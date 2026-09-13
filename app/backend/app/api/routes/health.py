"""Health endpoint."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.deps import OptionalPredictorDep
from app.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health(predictor: OptionalPredictorDep) -> HealthResponse:
    return HealthResponse(
        status="ok",
        model_loaded=predictor is not None,
        model_path=str(predictor.model_path) if predictor is not None else "unavailable",
    )
