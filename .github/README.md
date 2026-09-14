# GitHub Actions — prod deploy

Two workflows on **push to `main`** (path-filtered) plus **Run workflow**.

| Workflow | Paths | What it does |
|----------|--------|----------------|
| `deploy-frontend.yml` | `app/frontend/**` | `npm ci` → Vite build → S3 sync → CloudFront invalidation |
| `deploy-backend.yml` | `app/backend/**`, `app/model/**` | Docker `linux/amd64` → ECR → `lambda update-function-code` |

Terraform is **not** in these pipelines. Apply infra once locally, then set the variables below. First backend deploy needs the Lambda function to already exist (second `terraform apply` after the first image, **or** push one image manually then apply).

## GitHub configuration

1. Create environment **`prod`**.
2. Enable OIDC: IAM role trusted by `token.actions.githubusercontent.com` for this repo, `ref:refs/heads/main`.
3. Repository (or environment) **variables**:

| Variable | Example |
|----------|---------|
| `AWS_REGION` | `us-east-1` |
| `AWS_ROLE_ARN` | `arn:aws:iam::123:role/github-actions-prod` |
| `VITE_API_BASE_URL` | Function URL (no trailing slash) |
| `FRONTEND_S3_BUCKET` | Terraform output `frontend_bucket` |
| `CLOUDFRONT_DISTRIBUTION_ID` | Terraform output `distribution_id` |
| `ECR_REPOSITORY` | Terraform output `ecr_repository_name` (name only, not the full URI) |
| `LAMBDA_FUNCTION_NAME` | Terraform output `function_name` |

IAM on the role (least privilege): S3 sync to the UI bucket, `cloudfront:CreateInvalidation`, ECR push to the API repo, `lambda:UpdateFunctionCode` + `GetFunction` on the API function.

## Caching

- Frontend: `setup-node` `cache: npm` keyed on `package-lock.json`.
- Backend: Buildx `type=gha` layer cache (`scope=lambda-api`).
- Vite hashed files: `Cache-Control: immutable`; `index.html` is `no-cache`.
