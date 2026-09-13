"""HTTP middleware for request/response logging."""

from __future__ import annotations

import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log method, path, status, and duration. Health checks stay at DEBUG."""

    async def dispatch(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        started = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            duration_ms = (time.perf_counter() - started) * 1000
            logger.exception(
                "request failed method=%s path=%s duration_ms=%.1f",
                request.method,
                request.url.path,
                duration_ms,
            )
            raise

        duration_ms = (time.perf_counter() - started) * 1000
        log = logger.debug if request.url.path == "/health" else logger.info
        log(
            "request completed method=%s path=%s status=%s duration_ms=%.1f",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )
        return response
