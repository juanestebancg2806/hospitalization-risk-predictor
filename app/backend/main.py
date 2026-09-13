"""Uvicorn entrypoint. Keeps the backend root minimal."""

from app.main import app

__all__ = ["app"]
