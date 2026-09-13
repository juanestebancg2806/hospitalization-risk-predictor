"""Domain and application exceptions.

Services raise these; the API layer maps them to standardized HTTP responses.
"""

from __future__ import annotations

from typing import Any


class AppError(Exception):
    """Base application error with a stable machine-readable code."""

    code: str = "app_error"
    status_code: int = 500

    def __init__(
        self,
        message: str,
        *,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.details = details or {}
        super().__init__(message)


class ModelNotLoadedError(AppError):
    """Raised when inference is requested before the model is available."""

    code = "model_not_loaded"
    status_code = 503

    def __init__(self, message: str = "Model is not loaded") -> None:
        super().__init__(message)


class MissingFeaturesError(AppError):
    """Raised when the payload is missing columns required by the pipeline."""

    code = "missing_features"
    status_code = 400

    def __init__(self, missing: list[str]) -> None:
        self.missing = missing
        super().__init__(
            "Missing required features for prediction",
            details={"missing": missing},
        )


class ModelFileNotFoundError(AppError):
    """Raised when the model artifact cannot be found on disk."""

    code = "model_file_not_found"
    status_code = 500

    def __init__(self, model_path: str) -> None:
        super().__init__(
            "Model file not found",
            details={"model_path": model_path},
        )
