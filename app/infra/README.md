# AWS Terraform — hospitalization-risk MVP

Root module **composes** two children. It does not declare ECR/Lambda/S3 resources itself.

```text
app/infra/
  versions.tf                 # terraform + provider pins
  providers.tf                # aws + default_tags
  backend.tf                  # S3 state in terraform-state-jec
  variables.tf                # inputs only
  locals.tf                   # naming + tags
  main.tf                     # module "api" / module "frontend"
  outputs.tf                  # URLs and ids for GitHub / the SPA
  terraform.tfvars.example
  modules/
    lambda_api/               # ECR, IAM, Lambda, Function URL, logs
    static_site/              # S3, OAC, CloudFront
```

## Conventions

- **One stack** (`environment=prod`). Do not add `envs/dev|prod` until you have two accounts.
- **Modules by capability**, not by AWS service name.
- **No resource blocks in the root.**
- **tfvars are gitignored** — copy the example file locally.
- **State** lives in S3 `terraform-state-jec` (`hospitalization-risk/prod/terraform.tfstate`), encrypted, `use_lockfile = true`. Prefer **versioning** on that bucket (not on the SPA bucket).
- **Image build/push is not Terraform.** Terraform only consumes `lambda_image_uri`.
- **SPA files are not Terraform.** GitHub Actions (or a local `s3 sync`) publishes `dist/`.
- **CORS in prod** is on the **Lambda Function URL**, not `CORS_ORIGINS` on the function. Setting both duplicates `Access-Control-Allow-Origin`.
- **OIDC / GitHub IAM role** are **not** in this stack. See [`.github/DEPLOY.md`](../../.github/DEPLOY.md).

After Lambda exists, **GitHub Actions** updates the image. A later `terraform apply` with `lambda_image_uri = ":v1"` will **roll the function back**. Either stop applying image changes, or update `tfvars` to the current URI before apply.

## First-time apply

Prerequisites: AWS credentials for this account, Terraform >= 1.10, Docker Desktop, the state bucket `terraform-state-jec` already created.

### 1. Local tfvars

```bash
cd app/infra
cp terraform.tfvars.example terraform.tfvars
```

Leave `lambda_image_uri = ""` for apply #1.

### 2. Init and apply #1 (no Lambda)

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan    # expect ECR, S3, CloudFront, Lambda IAM/logs; api_function_url = ""
terraform apply
```

CloudFront can take several minutes (`wait_for_deployment`).

```bash
terraform output
```

You should have `ecr_repository_url`, `frontend_bucket`, `frontend_url`, `distribution_id`. `api_function_url` and `function_name` stay empty.

### 3. First image (Lambda-compatible manifest)

From **`app/`** (parent of `backend/` and `model/`). `--provenance=false --sbom=false` is required: Lambda rejects Docker’s default OCI **index** + attestations.

```bash
cd ../   # app/
REGION=us-east-1
REPO=$(terraform -chdir=infra output -raw ecr_repository_url)

aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "${REPO%%/*}"

docker build --platform linux/amd64 --provenance=false --sbom=false \
  -f backend/Dockerfile.lambda \
  -t "${REPO}:v1" -t "${REPO}:latest" .

docker push "${REPO}:v1"
docker push "${REPO}:latest"
```

### 4. Apply #2 (Lambda + Function URL)

In `terraform.tfvars`:

```hcl
lambda_image_uri = "<ecr_repository_url>:v1"
```

```bash
cd infra
terraform apply    # expect 2 resources: aws_lambda_function + aws_lambda_function_url
terraform output -raw api_function_url
```

CORS on the Function URL is set to `frontend_url` (CloudFront). Confirm:

```bash
curl -sS "$(terraform output -raw api_function_url)health"
```

Expect `model_loaded: true` (first call may take ~30s — cold start).

### 5. GitHub + SPA

Set Actions variables from outputs (see [`.github/DEPLOY.md`](../../.github/DEPLOY.md)). Then run **Deploy frontend**, or:

```bash
cd ../frontend
VITE_API_BASE_URL="$(terraform -chdir=../infra output -raw api_function_url)" npm run build
aws s3 sync dist/ "s3://$(terraform -chdir=../infra output -raw frontend_bucket)" --delete
aws cloudfront create-invalidation \
  --distribution-id "$(terraform -chdir=../infra output -raw distribution_id)" \
  --paths "/*"
```

Open `terraform output -raw frontend_url`.

### Destroy later

`terraform destroy` removes ECR, Lambda, S3 UI, CloudFront. **Keep** the OIDC provider, GitHub deploy role, GitHub variables (except Function URL / CloudFront id, which change), and `terraform-state-jec`. You must **push a new image** before apply #2 after a destroy.

## Commands (day to day)

```bash
cd app/infra
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```
