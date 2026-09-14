variable "name" {
  type        = string
  description = "Prefix for frontend resources (e.g. hospitalization-risk-prod)."
}

variable "price_class" {
  type        = string
  description = "CloudFront price class. PriceClass_100 is cheapest (NA + EU)."
  default     = "PriceClass_100"
}
