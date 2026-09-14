output "bucket_name" {
  description = "S3 bucket to sync app/frontend/dist into."
  value       = aws_s3_bucket.site.bucket
}

output "distribution_url" {
  description = "HTTPS origin of the SPA (use as CORS origin and in the browser)."
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "distribution_id" {
  description = "CloudFront id for cache invalidations after s3 sync."
  value       = aws_cloudfront_distribution.site.id
}

output "distribution_domain_name" {
  description = "CloudFront domain without scheme."
  value       = aws_cloudfront_distribution.site.domain_name
}
