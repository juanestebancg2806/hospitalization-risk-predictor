/**
 * Shared react-hook-form + Zod wiring for patient forms.
 */
import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'

import {
  patientFeaturesSchema,
  type PatientFeatures,
} from '../schemas/patient'

export const patientFormResolver = zodResolver(
  patientFeaturesSchema,
) as Resolver<PatientFeatures>
