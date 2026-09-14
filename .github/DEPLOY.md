# GitHub Actions — prod deploy

Two workflows on **push to `main`** (path-filtered) plus **Run workflow**. Terraform is **not** in these pipelines. Create AWS infra locally first ([`app/infra/README.md`](../app/infra/README.md)).

| Workflow | Paths | What it does |
|----------|--------|----------------|
| `deploy-frontend.yml` | `app/frontend/**` | `npm ci` → Vite build → S3 sync → CloudFront invalidation |
| `deploy-backend.yml` | `app/backend/**`, `app/model/**` | Docker `linux/amd64` → ECR → `lambda update-function-code` |

Do **not** run the backend workflow until apply **#2** has created the Lambda. The image build sets `provenance: false` and `sbom: false` so Lambda accepts the manifest.

Use **one IAM role per GitHub repo**. Reuse only the account OIDC **identity provider**.

## GitHub configuration

1. Repo → **Settings** → **Environments** → create **`prod`** (jobs set `environment: prod`).
2. OIDC (once per AWS account): IAM identity provider  
   `https://token.actions.githubusercontent.com`, audience `sts.amazonaws.com`.
3. IAM role (this repo only), e.g. `github-actions-hospitalization-risk-prod`.  
   Jobs request `sts.amazonaws.com` as `aud`.

**Trust `sub`:** repositories created **after 15 July 2026** (this one: 2026-09-13) use GitHub’s [immutable subject](https://github.blog/changelog/2026-04-23-immutable-subject-claims-for-github-actions-oidc-tokens/). A policy of `repo:OWNER/REPO:*` **will not match**. Include owner and repo **ids** (`gh api repos/OWNER/REPO` → `owner.id` and `id`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": [
            "repo:OWNER@OWNER_ID/REPO@REPO_ID:*",
            "repo:OWNER/REPO:*"
          ]
        }
      }
    }
  ]
}
```

This repo: `repo:juanestebancg2806@64322372/hospitalization-risk-predictor@1368504091:*`.  
`environment: prod` in the workflow makes `sub` end with `:environment:prod` (not only `ref:refs/heads/main`). Wildcards must be under **`StringLike`**.

4. Environment (or repository) **Actions variables** — not secrets (`vars.*` in YAML):

| Variable | Source |
|----------|--------|
| `AWS_REGION` | `us-east-1` |
| `AWS_ROLE_ARN` | Full role ARN |
| `VITE_API_BASE_URL` | `terraform output -raw api_function_url` (after apply #2). No quotes. Trailing slash is stripped at build. |
| `FRONTEND_S3_BUCKET` | `terraform output -raw frontend_bucket` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `terraform output -raw distribution_id` |
| `ECR_REPOSITORY` | `terraform output -raw ecr_repository_name` (name only) |
| `LAMBDA_FUNCTION_NAME` | `terraform output -raw function_name` |

Leave `VITE_API_BASE_URL` unset until the Function URL exists (`env.ts` requires it). After destroy/re-apply, update Function URL and CloudFront id; bucket and ECR **names** stay the same in this account.

## IAM on the GitHub role

Least privilege for these workflows only:

- S3 `ListBucket` / `GetBucketLocation` on the UI bucket; `GetObject` / `PutObject` / `DeleteObject` on `bucket/*`
- `cloudfront:CreateInvalidation` on the distribution
- `ecr:GetAuthorizationToken` on `*` (required by AWS)
- ECR push actions on `repository/hospitalization-risk-prod-api`
- `lambda:UpdateFunctionCode`, `GetFunction`, `GetFunctionConfiguration` on the API function

No `AdministratorAccess`. Terraform apply/destroy stays on your laptop.

`Could not assume role with OIDC: Not authorized to perform sts:AssumeRoleWithWebIdentity` is almost always a **`sub` mismatch** (immutable ids, or trust only `ref:refs/heads/main` while the job uses `environment: prod`). CloudTrail `AssumeRoleWithWebIdentity` in `us-east-1` shows the rejected `sub`. A Node 20 deprecation warning on `configure-aws-credentials@v4` is **not** that error.

## Caching

- Frontend: `setup-node` `cache: npm` keyed on `package-lock.json`.
- Backend: Buildx `type=gha` (`scope=lambda-api`).
- Vite hashed files: `Cache-Control: immutable`; `index.html` is `no-cache`.
