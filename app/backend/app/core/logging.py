"""Logging setup for the application.

Uses the stdlib logging module with a single stdout handler so logs work
consistently in Docker and local runs.
"""

from __future__ import annotations

import logging
import sys
from datetime import UTC, datetime


class UtcFormatter(logging.Formatter):
    """Format timestamps in UTC ISO-8601 (…Z)."""

    def formatTime(self, record: logging.LogRecord, datefmt: str | None = None) -> str:
        dt = datetime.fromtimestamp(record.created, tz=UTC)
        if datefmt:
            return dt.strftime(datefmt)
        return dt.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


_CONFIGURED = False


def configure_logging(level: str = "INFO") -> None:
    """Configure root logging once. Safe to call multiple times."""
    global _CONFIGURED

    numeric_level = getattr(logging, level.upper(), logging.INFO)
    formatter = UtcFormatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    )

    root = logging.getLogger()
    root.setLevel(numeric_level)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(numeric_level)
    handler.setFormatter(formatter)

    # Replace handlers to avoid duplicate lines under uvicorn --reload
    root.handlers.clear()
    root.addHandler(handler)

    # Keep third-party noise down unless we are debugging the app itself
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("watchfiles").setLevel(logging.WARNING)
    logging.getLogger("asyncio").setLevel(logging.WARNING)

    _CONFIGURED = True
    logging.getLogger(__name__).debug(
        "logging configured level=%s",
        logging.getLevelName(numeric_level),
    )


def get_logger(name: str) -> logging.Logger:
    """Return a module logger. Prefer ``logging.getLogger(__name__)`` at call sites."""
    return logging.getLogger(name)
