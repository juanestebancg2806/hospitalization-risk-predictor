# Backend API

FastAPI service that loads `app/model/modelo_riesgo_hospitalizacion_v1.pkl` and exposes `/predict`.

## Architecture (layered)

Chosen over feature-based/DDD because this API has **one use-case** (risk prediction) and no complex domain model. Layers keep a clean root and clear dependency direction:

```text
main.py                 # Thin uvicorn entry (re-exports app.main:app)
docker-compose.yml      # Production-like run
docker-compose.dev.yml  # Hot-reload while developing
Dockerfile

app/
  main.py               # FastAPI factory + lifespan
  core/                 # Shared kernel (no FastAPI, no ML)
    config.py
    exceptions.py
    logging.py          # Stdlib logging setup (UTC ISO format)
  schemas/              # Shared contracts (Pydantic DTOs)
  services/             # Application / use-case logic
  api/                  # HTTP adapters only
    middleware.py       # Request timing logs
    deps.py
    errors.py
    router.py
    routes/
```

### Boundaries

| Layer | May import | Must not |
|-------|------------|----------|
| `core` | stdlib / third-party config only | `api`, `services`, `schemas` |
| `schemas` | pydantic | `api`, `services` |
| `services` | `core`, `schemas`, ML libs | `api` / FastAPI |
| `api` | `core`, `schemas`, `services`, FastAPI | — |

Dependency flow: **api → services → schemas/core**.

### Logging

- Format: `UTC ISO-8601 | LEVEL | logger.name | message`
- Level via `LOG_LEVEL` (`DEBUG` in `docker-compose.dev.yml`, `INFO` otherwise)
- Request middleware logs method/path/status/duration (`/health` at DEBUG)
- Predictions log score/class only — not full clinical payloads

### Error responses

```json
{
  "error": "validation_error",
  "message": "Request validation failed",
  "details": {}
}
```

## Run (from this directory: `app/backend`)

```bash
# production-like
docker compose up --build

# hot-reload while coding
docker compose -f docker-compose.dev.yml up --build

# if port 8000 is busy
API_PORT=8001 docker compose -f docker-compose.dev.yml up --build

# or locally without Docker
uv sync
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

With the Compose **dev** file, this folder is bind-mounted and uvicorn reloads on save. Rebuild only when dependencies change (`uv add` / `uv.lock`).
