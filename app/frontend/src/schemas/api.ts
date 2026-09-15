import { z } from 'zod'

/** Matches backend `ErrorResponse`. */
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).default({}),
})

export type ApiErrorBody = z.infer<typeof apiErrorSchema>

/** Matches backend `HealthResponse`. */
export const healthResponseSchema = z.object({
  status: z.string(),
  model_loaded: z.boolean(),
  model_path: z.string(),
})

export type HealthResponse = z.infer<typeof healthResponseSchema>

/** Matches backend `PredictionResponse`. */
export const predictionResponseSchema = z.object({
  probabilidad_hospitalizacion_12m: z.number(),
  clase_predicha: z.number().int(),
  umbral_usado: z.number(),
})

export type PredictionResponse = z.infer<typeof predictionResponseSchema>
