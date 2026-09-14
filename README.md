# hospitalization-risk-predictor

ML pipeline to predict 12-month hospitalization risk in diabetes and hypertension patients using clinical, demographic, and utilization data. Includes EDA, model comparison (Logistic Regression, Random Forest, XGBoost, LightGBM) with class imbalance handling, and a production-ready API for deployment.

## Project layout

```text
app/
  backend/   # FastAPI layered app (uv + Docker)
    main.py  # uvicorn + Lambda handler (Mangum)
    Dockerfile.lambda
    app/     # core / schemas / services / api
  model/     # Trained pipeline (.pkl)
  frontend/  # Vite + React
  infra/     # Terraform (AWS: Lambda API + static site)
.github/workflows/  # prod deploy on push to main
notebooks/   # EDA and training
```

## Backend (Docker Compose)

Requires [Docker](https://docs.docker.com/get-docker/) with Compose v2.

Compose files live next to the API in `app/backend/` (with the Dockerfile). Run from that directory:

```bash
cd app/backend
```

### Production-like (no hot-reload)

```bash
docker compose up --build
```

If port 8000 is already in use:

```bash
API_PORT=8001 docker compose up --build
```

### Development (hot-reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

If port 8000 is busy:

```bash
API_PORT=8001 docker compose -f docker-compose.dev.yml up --build
```

Code in `app/backend/` reloads automatically. Rebuild only when dependencies change.

API (default host port `8000`):

- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health
- Predict: `POST http://localhost:8000/predict`

Stop:

```bash
docker compose down
# or
docker compose -f docker-compose.dev.yml down
```

The model is mounted from `../model` (`app/model/`). Dependencies are locked with **uv** (`uv.lock`) and installed inside the image.

## Backend (local uv, optional)

`.venv` is local-only and **gitignored** — do not commit it. Docker builds its own environment from the lockfile.

```bash
cd app/backend
uv sync
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

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
