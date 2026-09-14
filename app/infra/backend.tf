# Remote state in the shared bucket `terraform-jec`.
# Locking uses the S3 lock object (Terraform >= 1.10); no DynamoDB table.

terraform {
  backend "s3" {
    bucket       = "terraform-state-jec"
    key          = "hospitalization-risk/prod/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
