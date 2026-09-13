# Backend API

FastAPI service that loads `app/model/modelo_riesgo_hospitalizacion_v1.pkl` and exposes `/predict`.

Local virtualenv (`.venv`) is created by `uv sync` and must stay out of git — see the root `.gitignore`. Prefer running via Docker Compose from the repo root:

```bash
docker compose up --build
```
