"""Prediction endpoint."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.deps import PredictorDep
from app.schemas import PatientFeatures, PredictionResponse

router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict(
    patient: PatientFeatures,
    predictor: PredictorDep,
) -> PredictionResponse:
    return predictor.predict(patient)
