"""Cross-cutting API schemas (errors, health)."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """Uniform error payload returned by all API failure paths."""

    error: str
    message: str
    details: dict[str, Any] = {}


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_path: str
