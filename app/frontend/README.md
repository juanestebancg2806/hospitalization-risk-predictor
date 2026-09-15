# Frontend (Vite + React + TypeScript + Tailwind)

Spanish UI: service availability check, multi-step patient form, example patient, `POST /predict`.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`); Rubik + Source Serif 4 + JetBrains Mono via `@fontsource`
- Axios (`src/api/httpClient.ts`)
- react-router-dom (layout + `Outlet`, error/404)
- zod + react-hook-form + `@hookform/resolvers` (messages via `lib/zodEs.ts`)

## Typography

Fonts ship from `package.json` (`@fontsource/*`), imported in `src/index.css` — not from Google Fonts in `index.html`.

| Role | Family | Tailwind |
|------|--------|----------|
| UI / body | Rubik | `font-sans` (default) |
| Page titles | Source Serif 4 | `font-display` (`h1`) |
| Meta, JSON, chips | JetBrains Mono | `font-mono` |

Scale (`@theme` in `index.css`): `caption` 11px → `xs` 12 → `sm` 14 → `base` 16 → `lg` 18 → `xl` 20 → `3xl`/`4xl` titles. Use `text-caption` for chips/hints/footer; `text-sm` for labels and buttons; `text-base` for lead copy. Do not add `text-[11px]`.

## Color

Cool slate neutrals + one cyan-teal (`brand`). Do not tint grays green (that reads as 2010s “wellness EMR”). Risk bands are labeled pills (`risk-high` / `mid` / `low`); never reuse `brand` as a traffic light.

| Token | Role |
|-------|------|
| `canvas` | Page wash (`#f3f6f8`) |
| `surface-raised` | Cards / header |
| `ink` | Body text (navy-ink, not olive) |
| `brand` | CTA, focus, product accent |
| `shadow-card` / `shadow-cta` | Elevation, not hard document borders |

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
2. **Cargar paciente de ejemplo** fills the form, jumps to review (`lib/randomPatient.ts`)
3. Submit → `POST /predict` (`api/predict.ts`)

## Production deploy

Not Terraform. After infra exists, [`.github/workflows/deploy-frontend.yml`](../../.github/workflows/deploy-frontend.yml) on push to `main` (`app/frontend/**`) or **Run workflow**:

`npm ci` → build with `VITE_API_BASE_URL` → `s3 sync` (hashed assets immutable; `index.html` no-cache) → CloudFront `/*` invalidation.

Variables: [`.github/DEPLOY.md`](../../.github/DEPLOY.md). After destroy/re-apply, update `VITE_API_BASE_URL` and `CLOUDFRONT_DISTRIBUTION_ID`.
