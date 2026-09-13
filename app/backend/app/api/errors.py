"""HTTP exception handlers that produce a uniform error payload."""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import AppError
from app.schemas import ErrorResponse


def _error_response(
    *,
    status_code: int,
    code: str,
    message: str,
    details: dict | None = None,
) -> JSONResponse:
    payload = ErrorResponse(
        error=code,
        message=message,
        details=details or {},
    )
    return JSONResponse(status_code=status_code, content=payload.model_dump())


async def app_error_handler(_request: Request, exc: AppError) -> JSONResponse:
    return _error_response(
        status_code=exc.status_code,
        code=exc.code,
        message=exc.message,
        details=exc.details,
    )


async def http_exception_handler(
    _request: Request,
    exc: StarletteHTTPException,
) -> JSONResponse:
    detail = exc.detail
    message = detail if isinstance(detail, str) else "HTTP error"
    details = {} if isinstance(detail, str) else {"detail": detail}
    return _error_response(
        status_code=exc.status_code,
        code="http_error",
        message=message,
        details=details,
    )


async def validation_exception_handler(
    _request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    return _error_response(
        status_code=422,
        code="validation_error",
        message="Request validation failed",
        details={"errors": jsonable_encoder(exc.errors())},
    )


async def unhandled_exception_handler(
    _request: Request,
    exc: Exception,
) -> JSONResponse:
    return _error_response(
        status_code=500,
        code="internal_server_error",
        message="An unexpected error occurred",
        details={"type": type(exc).__name__},
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Attach standardized exception handlers to the FastAPI app."""
    app.add_exception_handler(AppError, app_error_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
