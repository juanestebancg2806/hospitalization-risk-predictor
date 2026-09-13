"""Application settings loaded from environment variables."""

from __future__ import annotations

import os
from pathlib import Path

# backend/app/core/config.py → parents[3] == hospitalization-risk-predictor/app/
_APP_ROOT = Path(__file__).resolve().parents[3]
_DEFAULT_MODEL = _APP_ROOT / "model" / "modelo_riesgo_hospitalizacion_v1.pkl"


class Settings:
    """Runtime configuration for the API."""

    model_path: Path = Path(os.getenv("MODEL_PATH", str(_DEFAULT_MODEL)))
    app_title: str = "Hospitalization Risk Predictor"
    app_description: str = (
        "Predicts 12-month hospitalization risk from clinical/demographic features."
    )
    app_version: str = "0.1.0"


settings = Settings()
