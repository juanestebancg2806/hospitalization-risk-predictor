# hospitalization-risk-predictor

ML pipeline to predict 12-month hospitalization risk in diabetes and hypertension patients using clinical, demographic, and utilization data. Includes EDA, model comparison (Logistic Regression, Random Forest, XGBoost, LightGBM) with class imbalance handling, a FastAPI service, a React SPA, and AWS prod (Lambda Function URL + S3/CloudFront).

## Project layout

```text
app/
  backend/           # FastAPI (uv + Docker). See app/backend/README.md
    main.py          # uvicorn entry (no Mangum)
    handler.py       # Lambda adapter (Mangum)
    Dockerfile.lambda
    app/             # core / schemas / services / api
  model/             # Trained pipeline (.pkl)
  frontend/          # Vite + React. See app/frontend/README.md
  infra/             # Terraform. See app/infra/README.md
.github/             # Prod deploy + OIDC. See .github/README.md
notebooks/           # EDA and training
```

## Local development

### API (Docker Compose)

Requires [Docker](https://docs.docker.com/get-docker/) with Compose v2. From `app/backend/`:

```bash
docker compose up --build                                    # production-like
docker compose -f docker-compose.dev.yml up --build          # hot-reload
API_PORT=8001 docker compose -f docker-compose.dev.yml up --build
```

- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health
- Predict: `POST http://localhost:8000/predict`

The model is mounted from `app/model/`. Dependencies are locked with **uv**. Stop with `docker compose down`.

Optional, without Docker (`.venv` is gitignored):

```bash
cd app/backend
uv sync
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### SPA

```bash
cd app/frontend
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:8000
npm install
npm run dev
```

The UI gates on `GET /health` (`model_loaded`) before prediction. Details: [`app/frontend/README.md`](app/frontend/README.md).

## AWS production

Bootstrap is **two Terraform applies** plus one Docker push (`linux/amd64`, `--provenance=false`). Then GitHub Actions deploys on push to `main`.

| Piece | Notes |
|-------|--------|
| Infra | [`app/infra/README.md`](app/infra/README.md) — first-time apply |
| CI/CD | [`.github/README.md`](.github/README.md) — OIDC (immutable `sub` after 2026-07-15), env `prod` |
| Lambda image | [`app/backend/README.md`](app/backend/README.md) — `Dockerfile.lambda`, CORS on Function URL |

Do not set `CORS_ORIGINS` on the Lambda env to the CloudFront URL; Function URL CORS already allows that origin.

## Example prediction

```bash
curl -s http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "departamento": "Bogotá D.C.",
    "zona": "Urbana",
    "sexo": "F",
    "edad_anios": 62,
    "grupo_edad": "60_74",
    "nivel_socioeconomico": "Medio",
    "regimen_afiliacion": "Contributivo",
    "nivel_educativo": "Secundaria",
    "estado_civil": "Casado_union_libre",
    "situacion_laboral": "Jubilado",
    "personas_hogar": 2,
    "tipo_vivienda": "Propia",
    "diabetes_tipo": "Tipo_2",
    "anios_desde_dx_diabetes": 8,
    "anios_desde_dx_hipertension": 12,
    "imc": 29.5,
    "perimetro_abdominal_cm": 98,
    "tabaquismo": "Nunca",
    "cigarrillos_dia": 0,
    "alcohol_frecuencia": "Nunca",
    "actividad_fisica_min_sem": 90,
    "calidad_dieta_0_100": 60,
    "horas_sueno": 7,
    "estres_0_10": 4,
    "consultas_atencion_primaria_12m": 4,
    "urgencias_12m": 1,
    "gasto_bolsillo_cop_mensual": 80000,
    "tension_sistolica_mmhg": 145,
    "tension_diastolica_mmhg": 88,
    "hba1c_pct": 7.2,
    "glucosa_ayunas_mg_dl": 140,
    "colesterol_ldl_mg_dl": 130,
    "trigliceridos_mg_dl": 160,
    "egfr_ml_min_1_73m2": 72,
    "albuminuria_categoria": "A1",
    "medicamento_antidiabetico_principal": "Metformina",
    "usa_insulina": 0,
    "medicamento_antihipertensivo_principal": "IECA",
    "usa_estatina": 1,
    "comorbilidad_erc": 0,
    "comorbilidad_dislipidemia": 1,
    "comorbilidad_obesidad": 1,
    "complicacion_diabetes_previa": 0,
    "riesgo_cv_10_anios_pct": 18.5,
    "control_glucemico": 0
  }'
```
