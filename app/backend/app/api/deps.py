"""FastAPI dependencies (composition root for request-scoped services)."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Request

from app.core.exceptions import ModelNotLoadedError
from app.services import RiskPredictor


def get_optional_predictor(request: Request) -> RiskPredictor | None:
    """Return the loaded predictor, or None when unavailable (e.g. health checks)."""
    predictor: RiskPredictor | None = getattr(request.app.state, "predictor", None)
    if predictor is None or not predictor.is_loaded:
        return None
    return predictor


def get_predictor(
    predictor: Annotated[RiskPredictor | None, Depends(get_optional_predictor)],
) -> RiskPredictor:
    """Require a loaded predictor; raise a domain error otherwise."""
    if predictor is None:
        raise ModelNotLoadedError()
    return predictor


OptionalPredictorDep = Annotated[
    RiskPredictor | None,
    Depends(get_optional_predictor),
]
PredictorDep = Annotated[RiskPredictor, Depends(get_predictor)]
