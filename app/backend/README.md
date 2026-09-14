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

Vite (`http://localhost:5173`) is allowed via `CORS_ORIGINS` in Compose (FastAPI `CORSMiddleware` in `app/main.py`). Defaults in `app/core/config.py` are the same if the env var is unset.

## AWS Lambda

Production is a **container image** on Lambda with a **Function URL** (`authorization_type = NONE`). Local Uvicorn must **not** import Mangum: Compose uses `main:app`; Lambda uses `handler.py` (`Mangum`).

| File | Role |
|------|------|
| `Dockerfile` + Compose | Local API on port 8000 |
| `Dockerfile.lambda` | Image for ECR / Lambda (`CMD ["handler.handler"]`) |
| `handler.py` | Mangum adapter only |

Build context is **`app/`** (backend + `model/`). `uv export --no-emit-project` installs dependencies only; the app is `COPY`’d in.

**CORS in prod** is configured on the Function URL in Terraform (`modules/lambda_api`), origin = CloudFront URL. Do **not** also set `CORS_ORIGINS` on the Lambda environment to that URL — browsers then see two `Access-Control-Allow-Origin` values.

Image must be `linux/amd64` and a **single Docker/OCI image manifest** (not a Buildx index with attestations):

```bash
# from app/
docker build --platform linux/amd64 --provenance=false --sbom=false \
  -f backend/Dockerfile.lambda -t api:lambda .
```

GitHub Actions (`deploy-backend.yml`) uses the same Dockerfile and flags. Infra bootstrap (first ECR push + two Terraform applies) is in [`app/infra/README.md`](../infra/README.md).
