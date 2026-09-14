variable "aws_region" {
  type        = string
  description = "Region for all resources (ECR, Lambda, S3, CloudFront must align for Lambda+ECR)."
  default     = "us-east-1"
}

variable "project" {
  type        = string
  description = "Short name used in resource identifiers."
  default     = "hospitalization-risk"
}

variable "environment" {
  type        = string
  description = "Deployment stage (one stack for this MVP)."
  default     = "prod"

  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "environment must be dev or prod."
  }
}

variable "lambda_image_uri" {
  type        = string
  description = "ECR image URI for the API (account.dkr.ecr.region.amazonaws.com/repo:tag). Empty until the first image is pushed."
  default     = ""
}

variable "lambda_memory_mb" {
  type        = number
  description = "Lambda memory (CPU scales with this). 1024 is the MVP default."
  default     = 1024
}

variable "log_retention_days" {
  type        = number
  description = "CloudWatch Logs retention for the API."
  default     = 14
}
