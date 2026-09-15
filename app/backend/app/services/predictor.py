"""Risk prediction use-case: load sklearn pipeline and score patients."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from app.core.exceptions import (
    InvalidModelMetaError,
    MissingFeaturesError,
    ModelFileNotFoundError,
    ModelMetaNotFoundError,
    ModelNotLoadedError,
)
from app.schemas import PatientFeatures, PredictionResponse

logger = logging.getLogger(__name__)


class RiskPredictor:
    """Loads a sklearn pipeline + operating-point metadata and scores patients."""

    def __init__(
        self,
        model_path: Path,
        meta_path: Path | None = None,
    ) -> None:
        self._model_path = model_path
        self._meta_path = meta_path or model_path.with_name(
            f"{model_path.stem}_meta.json"
        )
        self._model: Any | None = None
        self._threshold: float | None = None
        self._meta: dict[str, Any] | None = None

    @property
    def model_path(self) -> Path:
        return self._model_path

    @property
    def meta_path(self) -> Path:
        return self._meta_path

    @property
    def threshold(self) -> float | None:
        return self._threshold

    @property
    def is_loaded(self) -> bool:
        return self._model is not None and self._threshold is not None

    def load(self) -> None:
        if not self._model_path.exists():
            logger.error("model file missing path=%s", self._model_path)
            raise ModelFileNotFoundError(str(self._model_path))

        if not self._meta_path.exists():
            logger.error("model meta missing path=%s", self._meta_path)
            raise ModelMetaNotFoundError(str(self._meta_path))

        logger.info("loading model path=%s", self._model_path)
        self._model = joblib.load(self._model_path)

        logger.info("loading model meta path=%s", self._meta_path)
        with self._meta_path.open(encoding="utf-8") as f:
            meta = json.load(f)

        threshold = meta.get("threshold_production", meta.get("t_top15"))
        if threshold is None:
            raise InvalidModelMetaError(
                str(self._meta_path),
                "missing threshold_production / t_top15",
            )
        try:
            threshold_f = float(threshold)
        except (TypeError, ValueError) as exc:
            raise InvalidModelMetaError(
                str(self._meta_path),
                f"threshold is not a float: {threshold!r}",
            ) from exc
        if not 0.0 < threshold_f < 1.0:
            raise InvalidModelMetaError(
                str(self._meta_path),
                f"threshold out of range (0, 1): {threshold_f}",
            )

        self._meta = meta
        self._threshold = threshold_f

        feature_names = getattr(self._model, "feature_names_in_", None)
        n_features = len(feature_names) if feature_names is not None else 0
        logger.info(
            "model loaded n_features=%s threshold=%.6f candidato=%s",
            n_features,
            self._threshold,
            meta.get("candidato", "unknown"),
        )

    def unload(self) -> None:
        logger.info("unloading model path=%s", self._model_path)
        self._model = None
        self._threshold = None
        self._meta = None

    def predict(self, patient: PatientFeatures) -> PredictionResponse:
        if self._model is None or self._threshold is None:
            raise ModelNotLoadedError()

        row = pd.DataFrame([patient.model_dump()])
        expected = list(self._model.feature_names_in_)
        missing = [col for col in expected if col not in row.columns]
        if missing:
            logger.warning("prediction rejected missing_features=%s", missing)
            raise MissingFeaturesError(missing)

        X = row[expected]
        probabilities = self._model.predict_proba(X)[0]
        proba_positive = float(probabilities[1])
        clase = int(proba_positive >= self._threshold)

        result = PredictionResponse(
            probabilidad_hospitalizacion_12m=proba_positive,
            clase_predicha=clase,
            umbral_usado=self._threshold,
        )
        # Do not log raw clinical fields (PII / sensitive health data).
        logger.info(
            "prediction completed probabilidad=%.6f clase=%s umbral=%.6f",
            result.probabilidad_hospitalizacion_12m,
            result.clase_predicha,
            result.umbral_usado,
        )
        logger.debug(
            "prediction context edad_anios=%s sexo=%s grupo_edad=%s",
            patient.edad_anios,
            patient.sexo,
            patient.grupo_edad,
        )
        return result
