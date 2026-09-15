"""FastAPI dependencies (composition root for request-scoped services)."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Request

from app.core.exceptions import ModelNotLoadedError
from app.services import RiskPredictor, get_shared_predictor


def get_optional_predictor(request: Request) -> RiskPredictor | None:
    """Return the loaded predictor, or None when unavailable (e.g. health checks)."""
    predictor: RiskPredictor | None = getattr(request.app.state, "predictor", None)
    if predictor is not None and predictor.is_loaded:
        return predictor
    try:
        predictor = get_shared_predictor()
    except Exception:
        return None
    request.app.state.predictor = predictor
    return predictor if predictor.is_loaded else None


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
