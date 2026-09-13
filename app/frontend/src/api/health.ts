import { httpClient } from './httpClient'
import { toApiClientError } from './errors'
import {
  healthResponseSchema,
  type HealthResponse,
} from '../schemas/api'

type FetchHealthOptions = {
  signal?: AbortSignal
}

export async function fetchHealth(
  options: FetchHealthOptions = {},
): Promise<HealthResponse> {
  try {
    const { data } = await httpClient.get<unknown>('/health', {
      signal: options.signal,
    })
    return healthResponseSchema.parse(data)
  } catch (error) {
    throw toApiClientError(error)
  }
}
