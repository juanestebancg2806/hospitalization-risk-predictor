"""Risk prediction use-case: load sklearn pipeline and score patients."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from app.core.exceptions import (
    MissingFeaturesError,
    ModelFileNotFoundError,
    ModelNotLoadedError,
)
from app.schemas import PatientFeatures, PredictionResponse


class RiskPredictor:
    """Loads a sklearn pipeline and scores patient feature payloads."""

    def __init__(self, model_path: Path) -> None:
        self._model_path = model_path
        self._model: Any | None = None

    @property
    def model_path(self) -> Path:
        return self._model_path

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def load(self) -> None:
        if not self._model_path.exists():
            raise ModelFileNotFoundError(str(self._model_path))
        self._model = joblib.load(self._model_path)

    def unload(self) -> None:
        self._model = None

    def predict(self, patient: PatientFeatures) -> PredictionResponse:
        if self._model is None:
            raise ModelNotLoadedError()

        row = pd.DataFrame([patient.model_dump()])
        expected = list(self._model.feature_names_in_)
        missing = [col for col in expected if col not in row.columns]
        if missing:
            raise MissingFeaturesError(missing)

        X = row[expected]
        probabilities = self._model.predict_proba(X)[0]
        return PredictionResponse(
            probabilidad_hospitalizacion_12m=float(probabilities[1]),
            clase_predicha=int(probabilities.argmax()),
        )
