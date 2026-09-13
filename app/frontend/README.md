# Frontend (Vite + React + TypeScript + Tailwind)

MVP entry UI with health check, routing, and form-validation packages ready.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`) + IBM Plex (clinical cartography)
- Axios singleton (`src/api/httpClient.ts`)
- react-router-dom (layout + `Outlet`, error/404 routes)
- zod + react-hook-form + `@hookform/resolvers`

## Architecture

```text
pages/          # Route composition only
hooks/          # UI state + orchestration
api/            # HTTP + ApiClientError mapping + shared status types
schemas/        # Zod contracts
components/     # Presentational UI
app/router.tsx  # Layout route → Outlet; errorElement; 404
```

Flow: **pages → hooks/components → api/schemas**.

## Routes

| Path | Page |
|------|------|
| `/` | Home (MVP intro + health) |
| `/predict` | Prediction wizard (placeholder) |
| `*` | 404 |

## Environment

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend origin, e.g. `http://localhost:8000` |

Restart `npm run dev` after changing `.env`.

## Run

```bash
cd app/frontend
npm install
npm run dev
```

## Predict form

Route `/predict` — multi-step wizard (`PredictWizard` + `usePredictWizard`):

1. Sociodemográfico → antecedentes → clínica → tratamiento → revisión
2. **Generar paciente aleatorio** fills the form, jumps to review, and shows the JSON payload
3. Submit calls `POST /predict` via `api/predict.ts`
