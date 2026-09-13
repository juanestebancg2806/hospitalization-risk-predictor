"""Risk prediction use-case: load sklearn pipeline and score patients."""

from __future__ import annotations

import logging
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

logger = logging.getLogger(__name__)


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
            logger.error("model file missing path=%s", self._model_path)
            raise ModelFileNotFoundError(str(self._model_path))

        logger.info("loading model path=%s", self._model_path)
        self._model = joblib.load(self._model_path)
        feature_names = getattr(self._model, "feature_names_in_", None)
        n_features = len(feature_names) if feature_names is not None else 0
        logger.info("model loaded n_features=%s", n_features)

    def unload(self) -> None:
        logger.info("unloading model path=%s", self._model_path)
        self._model = None

    def predict(self, patient: PatientFeatures) -> PredictionResponse:
        if self._model is None:
            raise ModelNotLoadedError()

        row = pd.DataFrame([patient.model_dump()])
        expected = list(self._model.feature_names_in_)
        missing = [col for col in expected if col not in row.columns]
        if missing:
            logger.warning("prediction rejected missing_features=%s", missing)
            raise MissingFeaturesError(missing)

        X = row[expected]
        probabilities = self._model.predict_proba(X)[0]
        result = PredictionResponse(
            probabilidad_hospitalizacion_12m=float(probabilities[1]),
            clase_predicha=int(probabilities.argmax()),
        )
        # Do not log raw clinical fields (PII / sensitive health data).
        logger.info(
            "prediction completed probabilidad=%.6f clase=%s",
            result.probabilidad_hospitalizacion_12m,
            result.clase_predicha,
        )
        logger.debug(
            "prediction context edad_anios=%s sexo=%s grupo_edad=%s",
            patient.edad_anios,
            patient.sexo,
            patient.grupo_edad,
        )
        return result
