# AWS Terraform — hospitalization-risk MVP

Root module **composes** two children. It does not declare ECR/Lambda/S3 resources itself.

```text
app/infra/
  versions.tf                 # terraform + provider pins (single source of truth)
  providers.tf                # aws + default_tags
  backend.tf                  # S3 state in terraform-jec
  variables.tf                # inputs only
  locals.tf                   # naming + tags
  main.tf                     # module "api" / module "frontend"
  outputs.tf                  # URLs the app needs
  terraform.tfvars.example
  modules/
    lambda_api/               # ECR, IAM, Lambda, Function URL, logs
    static_site/              # S3, OAC, CloudFront
```

## Conventions

- **One stack** (`environment=prod`). Do not add `envs/dev|prod` until you actually have two accounts.
- **Modules by capability**, not by AWS service name (`lambda_api` not `ecr` + `lambda` + `iam` as separate root files).
- **No resource blocks in the root.** Easier to read and to reuse later.
- **tfvars are secrets-adjacent** — gitignored; copy the example file locally.
- **State** lives in S3 bucket `terraform-jec` (`hospitalization-risk/prod/terraform.tfstate`), encrypted, with S3 native lockfile.
- Image **build/push is not Terraform**. Terraform consumes `lambda_image_uri` after `docker push`.
- Frontend **files are not Terraform**. After apply: `aws s3 sync` `dist/` and invalidate CloudFront.

## Commands

```bash
cd app/infra
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt -recursive
terraform validate
terraform plan
```

After apply, publish the SPA (use outputs `frontend_bucket`, `frontend_url`, `distribution_id`):

```bash
cd app/frontend
VITE_API_BASE_URL=<api_function_url> npm run build
aws s3 sync dist/ s3://<frontend_bucket> --delete
aws cloudfront create-invalidation --distribution-id <distribution_id> --paths "/*"
```

