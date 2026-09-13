# Frontend (Vite + React + TypeScript + Tailwind)

Hello-world scaffold. HTTP client is ready; product UI not built yet.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4 via `@tailwindcss/vite`
- Axios (`src/api/httpClient.ts` singleton + interceptors)

## Environment

Copy the example env file and adjust the backend URL if needed:

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

## API client usage

```ts
import { httpClient } from './api/httpClient'

const { data } = await httpClient.get('/health')
```
