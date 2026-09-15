variable "name" {
  type        = string
  description = "Prefix for API resources (e.g. hospitalization-risk-prod)."
}

variable "image_uri" {
  type        = string
  description = "Full ECR image URI including tag. Leave empty on the first apply (repo only); set after docker push."
  default     = ""
}

variable "memory_mb" {
  type        = number
  description = "Lambda memory in MB."
}

variable "timeout_seconds" {
  type        = number
  description = "Lambda timeout. Cold start + sklearn predict needs headroom."
  default     = 30
}

variable "log_retention_days" {
  type        = number
  description = "CloudWatch log group retention."
}

variable "cors_origins" {
  type        = list(string)
  description = "Allowed browser origins (CloudFront URL). Empty → * until the frontend exists."
  default     = []
}

variable "model_path" {
  type        = string
  description = "MODEL_PATH inside the Lambda image."
  default     = "/var/task/model/modelo_riesgo_hospitalizacion_v1.pkl"
}

variable "model_meta_path" {
  type        = string
  description = "MODEL_META_PATH inside the Lambda image (operating threshold JSON)."
  default     = "/var/task/model/modelo_riesgo_hospitalizacion_v1_meta.json"
}
