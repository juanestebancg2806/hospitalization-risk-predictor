import axios from 'axios'
import { ZodError } from 'zod'

import { apiErrorSchema, type ApiErrorBody } from '../schemas/api'

/**
 * Normalized client error. Prefer this in UI over raw Axios/Zod errors.
 */
export class ApiClientError extends Error {
  readonly code: string
  readonly status: number | null
  readonly details: Record<string, unknown>

  constructor(
    message: string,
    options: {
      code?: string
      status?: number | null
      details?: Record<string, unknown>
      cause?: unknown
    } = {},
  ) {
    super(message, { cause: options.cause })
    this.name = 'ApiClientError'
    this.code = options.code ?? 'client_error'
    this.status = options.status ?? null
    this.details = options.details ?? {}
  }
}

function parseApiErrorBody(data: unknown): ApiErrorBody | null {
  const parsed = apiErrorSchema.safeParse(data)
  return parsed.success ? parsed.data : null
}

/** Map unknown failures into {@link ApiClientError}. Idempotent for already-mapped errors. */
export function toApiClientError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error
  }

  if (error instanceof ZodError) {
    return new ApiClientError(
      'La respuesta del servidor no tiene el formato esperado.',
      {
        code: 'validation_error',
        details: { issues: error.issues },
        cause: error,
      },
    )
  }

  if (axios.isAxiosError(error)) {
    const body = parseApiErrorBody(error.response?.data)
    if (body) {
      return new ApiClientError(body.message, {
        code: body.error,
        status: error.response?.status ?? null,
        details: body.details,
        cause: error,
      })
    }

    if (!error.response) {
      return new ApiClientError(
        'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.',
        {
          code: 'network_error',
          status: null,
          cause: error,
        },
      )
    }

    return new ApiClientError(
      error.message || 'Error inesperado al llamar al API',
      {
        code: 'http_error',
        status: error.response.status,
        cause: error,
      },
    )
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message, {
      code: 'unknown_error',
      cause: error,
    })
  }

  return new ApiClientError('Error desconocido', { code: 'unknown_error' })
}
