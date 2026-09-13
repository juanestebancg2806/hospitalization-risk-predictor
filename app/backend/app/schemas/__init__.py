"""Shared Pydantic contracts used by the API and services layers."""

from app.schemas.common import ErrorResponse, HealthResponse
from app.schemas.prediction import PatientFeatures, PredictionResponse

__all__ = [
    "ErrorResponse",
    "HealthResponse",
    "PatientFeatures",
    "PredictionResponse",
]
