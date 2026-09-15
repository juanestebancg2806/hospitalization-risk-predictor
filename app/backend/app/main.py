"""FastAPI application factory and lifespan hooks."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router, register_exception_handlers
from app.api.middleware import RequestLoggingMiddleware
from app.core.config import settings
from app.core.logging import configure_logging
from app.services import get_shared_predictor


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "starting app version=%s log_level=%s model_path=%s meta_path=%s",
        settings.app_version,
        settings.log_level,
        settings.model_path,
        settings.model_meta_path,
    )
    predictor = get_shared_predictor()
    app.state.predictor = predictor
    logger.info(
        "application startup complete threshold=%s",
        predictor.threshold,
    )
    yield
    # Do not unload: Lambda freezes this process and reuses it. Uvicorn --reload
    # starts a new interpreter anyway.


def create_app() -> FastAPI:
    configure_logging(settings.log_level)

    application = FastAPI(
        title=settings.app_title,
        description=settings.app_description,
        version=settings.app_version,
        lifespan=lifespan,
    )
    if settings.cors_origins:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    application.add_middleware(RequestLoggingMiddleware)
    register_exception_handlers(application)
    application.include_router(api_router)
    return application


app = create_app()
