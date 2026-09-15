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
    # Default: same stem as the .pkl with suffix _meta.json
    model_meta_path: Path = Path(
        os.getenv(
            "MODEL_META_PATH",
            str(model_path.with_name(f"{model_path.stem}_meta.json")),
        )
    )
    app_title: str = "Hospitalization Risk Predictor"
    app_description: str = (
        "Predicts 12-month hospitalization risk from clinical/demographic features."
    )
    app_version: str = "0.1.0"
    log_level: str = os.getenv("LOG_LEVEL", "INFO").upper()
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()
