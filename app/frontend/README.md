# Frontend (Vite + React + TypeScript + Tailwind)

Spanish MVP UI (“clinical cartography”): health gate, multi-step patient wizard, random sample payload, `POST /predict`.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`) + IBM Plex
- Axios (`src/api/httpClient.ts`)
- react-router-dom (layout + `Outlet`, error/404)
- zod + react-hook-form + `@hookform/resolvers` (messages via `lib/zodEs.ts`)

## Architecture

```text
pages/          # Route composition only
hooks/          # UI state + orchestration
api/            # HTTP + ApiClientError + shared types
schemas/        # Zod contracts (patient + API)
components/     # Presentational UI
app/router.tsx  # Layout → Outlet; errorElement; 404
config/env.ts   # Requires VITE_API_BASE_URL at build time
```

Flow: **pages → hooks/components → api/schemas**.

## Routes

| Path | Page |
|------|------|
| `/` | Home (intro + backend health) |
| `/predict` | Multi-step prediction wizard |
| `*` | 404 |

`useBackendStatus` calls `GET /health`. Predict stays blocked until `model_loaded` is true.

## Environment

```bash
cp .env.example .env
```

| Variable | Local | Prod (GitHub Actions `prod`) |
|----------|--------|------------------------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Lambda Function URL (`terraform output -raw api_function_url`) |

Vite **bakes this in at `npm run build`**. No trailing slash required (`env.ts` strips it). Restart `npm run dev` after changing `.env`. Do not set the GitHub variable to `""`.

The SPA origin in AWS is CloudFront (`frontend_url`). CORS for that origin is on the **Function URL**, not in this app. See [`app/infra/README.md`](../infra/README.md).

## Run

```bash
cd app/frontend
npm install
npm run dev      # http://localhost:5173 — API on :8000
npm run build    # dist/ for S3
npm run preview  # optional local preview of dist/
```

## Predict wizard

Route `/predict` (`PredictWizard` + `usePredictWizard`):

1. Sociodemográfico → antecedentes → clínica → tratamiento → revisión
2. **Generar paciente aleatorio** fills the form, jumps to review, shows JSON (`lib/randomPatient.ts`)
3. Submit → `POST /predict` (`api/predict.ts`)

## Production deploy

Not Terraform. After infra exists, [`.github/workflows/deploy-frontend.yml`](../../.github/workflows/deploy-frontend.yml) on push to `main` (`app/frontend/**`) or **Run workflow**:

`npm ci` → build with `VITE_API_BASE_URL` → `s3 sync` (hashed assets immutable; `index.html` no-cache) → CloudFront `/*` invalidation.

Variables: [`.github/README.md`](../../.github/README.md). After destroy/re-apply, update `VITE_API_BASE_URL` and `CLOUDFRONT_DISTRIBUTION_ID`.
