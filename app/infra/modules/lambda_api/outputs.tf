output "function_url" {
  description = "Lambda Function URL. Empty until lambda_image_uri is set."
  value       = try(aws_lambda_function_url.api[0].function_url, "")
}

output "ecr_repository_url" {
  description = "Repository URL for docker push."
  value       = aws_ecr_repository.api.repository_url
}

output "function_name" {
  description = "Lambda function name (empty until the image is set)."
  value       = try(aws_lambda_function.api[0].function_name, "")
}

output "ecr_repository_name" {
  description = "ECR repository name."
  value       = aws_ecr_repository.api.name
}
