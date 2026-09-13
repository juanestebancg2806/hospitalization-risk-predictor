"""Aggregate HTTP routers for the API layer."""

from fastapi import APIRouter

from app.api.routes import health_router, predict_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(predict_router)
