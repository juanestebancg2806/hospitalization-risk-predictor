import type { ApiClientError } from './errors'
import type { HealthResponse } from '../schemas/api'

/** UI-facing backend availability state (shared by hooks and presentational panels). */
export type BackendStatusState =
  | { kind: 'loading' }
  | { kind: 'ready'; health: HealthResponse }
  | { kind: 'error'; error: ApiClientError }
