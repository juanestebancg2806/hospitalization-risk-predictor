"""FastAPI application factory and lifespan hooks."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import api_router, register_exception_handlers
from app.core.config import settings
from app.services import RiskPredictor


@asynccontextmanager
async def lifespan(app: FastAPI):
    predictor = RiskPredictor(settings.model_path)
    predictor.load()
    app.state.predictor = predictor
    yield
    predictor.unload()
    app.state.predictor = None


def create_app() -> FastAPI:
    application = FastAPI(
        title=settings.app_title,
        description=settings.app_description,
        version=settings.app_version,
        lifespan=lifespan,
    )
    register_exception_handlers(application)
    application.include_router(api_router)
    return application


app = create_app()
