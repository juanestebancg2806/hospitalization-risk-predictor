import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { predictHospitalizationRisk } from '../api/predict'
import { toApiClientError, type ApiClientError } from '../api/errors'
import { patientFormResolver } from '../lib/form'
import {
  FORM_STEPS,
  REVIEW_STEP_INDEX,
  fieldNamesForStep,
} from '../lib/patientFormMeta'
import { createRandomPatient } from '../lib/randomPatient'
import type { PredictionResponse } from '../schemas/api'
import type { PatientFeatures } from '../schemas/patient'

const emptyDefaults = {
  sexo: '',
  edad_anios: NaN,
  grupo_edad: '',
  regimen_afiliacion: '',
  nivel_educativo: '',
  estado_civil: '',
  situacion_laboral: '',
  personas_hogar: NaN,
  tipo_vivienda: '',
  diabetes_tipo: '',
  anios_desde_dx_diabetes: NaN,
  anios_desde_dx_hipertension: NaN,
  imc: NaN,
  perimetro_abdominal_cm: NaN,
  tabaquismo: '',
  cigarrillos_dia: 0,
  alcohol_frecuencia: '',
  actividad_fisica_min_sem: NaN,
  calidad_dieta_0_100: NaN,
  horas_sueno: NaN,
  estres_0_10: NaN,
  consultas_atencion_primaria_12m: NaN,
  urgencias_12m: NaN,
  gasto_bolsillo_cop_mensual: NaN,
  tension_sistolica_mmhg: NaN,
  tension_diastolica_mmhg: NaN,
  hba1c_pct: NaN,
  glucosa_ayunas_mg_dl: NaN,
  colesterol_ldl_mg_dl: NaN,
  trigliceridos_mg_dl: NaN,
  egfr_ml_min_1_73m2: NaN,
  albuminuria_categoria: '',
  medicamento_antidiabetico_principal: '',
  usa_insulina: '' as unknown as 0,
  medicamento_antihipertensivo_principal: '',
  usa_estatina: '' as unknown as 0,
  comorbilidad_erc: '' as unknown as 0,
  comorbilidad_dislipidemia: '' as unknown as 0,
  comorbilidad_obesidad: '' as unknown as 0,
  complicacion_diabetes_previa: '' as unknown as 0,
  riesgo_cv_10_anios_pct: NaN,
  control_glucemico: '' as unknown as 0,
} satisfies Record<keyof PatientFeatures, unknown>

export function usePredictWizard() {
  const form = useForm<PatientFeatures>({
    resolver: patientFormResolver,
    defaultValues: emptyDefaults as unknown as PatientFeatures,
    mode: 'onTouched',
  })

  const [stepIndex, setStepIndex] = useState(0)
  const [highlightRandom, setHighlightRandom] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<ApiClientError | null>(null)
  const [result, setResult] = useState<PredictionResponse | null>(null)

  const isReview = stepIndex === REVIEW_STEP_INDEX
  const totalSteps = FORM_STEPS.length + 1

  const fillRandom = useCallback(() => {
    const sample = createRandomPatient()
    form.reset(sample)
    setHighlightRandom(true)
    setSubmitError(null)
    setResult(null)
    setStepIndex(REVIEW_STEP_INDEX)
  }, [form])

  const goNext = useCallback(async () => {
    if (isReview) return
    const names = fieldNamesForStep(stepIndex)
    const ok = await form.trigger(names)
    if (ok) setStepIndex((i) => i + 1)
  }, [form, isReview, stepIndex])

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1))
  }, [])

  const submit = form.handleSubmit(async (values) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setResult(null)
    try {
      const prediction = await predictHospitalizationRisk(values)
      setResult(prediction)
      setHighlightRandom(false)
    } catch (error) {
      setSubmitError(toApiClientError(error))
    } finally {
      setIsSubmitting(false)
    }
  })

  return {
    form,
    stepIndex,
    setStepIndex,
    isReview,
    totalSteps,
    currentStep: isReview ? null : FORM_STEPS[stepIndex],
    fillRandom,
    goNext,
    goBack,
    submit,
    isSubmitting,
    submitError,
    result,
    clearResult: () => setResult(null),
    highlightRandom,
    clearRandomHighlight: () => setHighlightRandom(false),
  }
}
