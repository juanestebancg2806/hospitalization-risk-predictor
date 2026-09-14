# Root module: composition only. Resource details live in modules/.

module "frontend" {
  source = "./modules/static_site"

  name = local.name
}

module "api" {
  source = "./modules/lambda_api"

  name               = local.name
  image_uri          = var.lambda_image_uri
  memory_mb          = var.lambda_memory_mb
  log_retention_days = var.log_retention_days
  cors_origins       = compact([module.frontend.distribution_url])
}
