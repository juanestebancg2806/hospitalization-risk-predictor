import { httpClient } from './httpClient'
import { toApiClientError } from './errors'
import {
  predictionResponseSchema,
  type PredictionResponse,
} from '../schemas/api'
import type { PatientFeatures } from '../schemas/patient'

type PredictOptions = {
  signal?: AbortSignal
}

export async function predictHospitalizationRisk(
  patient: PatientFeatures,
  options: PredictOptions = {},
): Promise<PredictionResponse> {
  try {
    const { data } = await httpClient.post<unknown>('/predict', patient, {
      signal: options.signal,
    })
    return predictionResponseSchema.parse(data)
  } catch (error) {
    throw toApiClientError(error)
  }
}
