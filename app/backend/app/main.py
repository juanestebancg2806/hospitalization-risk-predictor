"""FastAPI application factory and lifespan hooks."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import api_router, register_exception_handlers
from app.api.middleware import RequestLoggingMiddleware
from app.core.config import settings
from app.core.logging import configure_logging
from app.services import RiskPredictor

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "starting app version=%s log_level=%s model_path=%s",
        settings.app_version,
        settings.log_level,
        settings.model_path,
    )
    predictor = RiskPredictor(settings.model_path)
    predictor.load()
    app.state.predictor = predictor
    logger.info("application startup complete")
    yield
    logger.info("shutting down application")
    predictor.unload()
    app.state.predictor = None
    logger.info("application shutdown complete")


def create_app() -> FastAPI:
    configure_logging(settings.log_level)

    application = FastAPI(
        title=settings.app_title,
        description=settings.app_description,
        version=settings.app_version,
        lifespan=lifespan,
    )
    application.add_middleware(RequestLoggingMiddleware)
    register_exception_handlers(application)
    application.include_router(api_router)
    return application


app = create_app()
