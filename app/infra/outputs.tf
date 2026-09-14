output "api_function_url" {
  description = "HTTPS origin for the FastAPI Lambda (set as VITE_API_BASE_URL)."
  value       = module.api.function_url
}

output "frontend_bucket" {
  description = "S3 bucket to sync app/frontend/dist into."
  value       = module.frontend.bucket_name
}

output "frontend_url" {
  description = "CloudFront URL for the SPA. Add this to Lambda CORS."
  value       = module.frontend.distribution_url
}

output "ecr_repository_url" {
  description = "Push the Lambda container image here."
  value       = module.api.ecr_repository_url
}

output "ecr_repository_name" {
  description = "ECR repository name (GitHub var ECR_REPOSITORY)."
  value       = module.api.ecr_repository_name
}

output "function_name" {
  description = "Lambda function name (GitHub var LAMBDA_FUNCTION_NAME). Empty until apply #2."
  value       = module.api.function_name
}

output "distribution_id" {
  description = "CloudFront distribution id (GitHub var CLOUDFRONT_DISTRIBUTION_ID)."
  value       = module.frontend.distribution_id
}
