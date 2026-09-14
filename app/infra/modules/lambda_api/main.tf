locals {
  function_name      = "${var.name}-api"
  create_function    = var.image_uri != ""
  cors_allow_origins = length(var.cors_origins) > 0 ? var.cors_origins : ["*"]
}

# --- ECR ---

resource "aws_ecr_repository" "api" {
  name                 = local.function_name
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

data "aws_ecr_lifecycle_policy_document" "api" {
  rule {
    priority    = 1
    description = "Keep the last 3 images"

    selection {
      tag_status   = "any"
      count_type   = "imageCountMoreThan"
      count_number = 3
    }

    action {
      type = "expire"
    }
  }
}

resource "aws_ecr_lifecycle_policy" "api" {
  repository = aws_ecr_repository.api.name
  policy     = data.aws_ecr_lifecycle_policy_document.api.json
}

# --- IAM (logs + pull this repo only) ---

data "aws_iam_policy_document" "assume_lambda" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = "${local.function_name}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_lambda.json
}

data "aws_iam_policy_document" "lambda" {
  statement {
    sid = "Logs"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.api.arn}:*"]
  }

  statement {
    sid       = "EcrAuth"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    sid = "EcrPull"
    actions = [
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchCheckLayerAvailability",
    ]
    resources = [aws_ecr_repository.api.arn]
  }
}

resource "aws_iam_role_policy" "lambda" {
  name   = "lambda-api"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.lambda.json
}

# --- Logs ---

resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = var.log_retention_days
}

# --- Lambda + Function URL (after the image exists) ---

resource "aws_lambda_function" "api" {
  count = local.create_function ? 1 : 0

  function_name = local.function_name
  role          = aws_iam_role.lambda.arn
  package_type  = "Image"
  image_uri     = var.image_uri
  memory_size   = var.memory_mb
  timeout       = var.timeout_seconds
  architectures = ["x86_64"]

  environment {
    variables = {
      MODEL_PATH   = var.model_path
      CORS_ORIGINS = join(",", local.cors_allow_origins)
      LOG_LEVEL    = "INFO"
    }
  }

  logging_config {
    log_format = "Text"
    log_group  = aws_cloudwatch_log_group.api.name
  }

  depends_on = [
    aws_iam_role_policy.lambda,
    aws_cloudwatch_log_group.api,
  ]
}

# Auth NONE automatically attaches public InvokeFunctionUrl (+ InvokeFunction
# with InvokedViaFunctionUrl). Do not add aws_lambda_permission for that.
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "api" {
  count = local.create_function ? 1 : 0

  function_name      = aws_lambda_function.api[0].function_name
  authorization_type = "NONE"
  invoke_mode        = "BUFFERED"

  cors {
    allow_origins = local.cors_allow_origins
    allow_methods = ["GET", "POST"]
    allow_headers = ["content-type"]
    max_age       = 86400
  }
}
