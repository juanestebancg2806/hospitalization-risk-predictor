import { z } from 'zod'

import '../lib/zodEs'

/** Binary flags expected by the API (0 | 1). */
const flag01 = z.union([z.literal(0), z.literal(1)], {
  error: 'Selecciona Sí o No',
})

const requiredSelect = <const T extends readonly [string, ...string[]]>(
  values: T,
) => z.enum(values, { error: 'Selecciona una opción' })

const numberMsg = { error: 'Ingresa un número válido' } as const
const nonNeg = z.number(numberMsg).min(0, 'Debe ser mayor o igual a 0')
const positive = z.number(numberMsg).gt(0, 'Debe ser mayor que 0')
/**
 * Patient payload schema — mirrors backend `PatientFeatures`.
 * Pair numeric fields with RHF `valueAsNumber` (see FieldControl).
 * Validation messages are in Spanish.
 */
export const patientFeaturesSchema = z.object({
  sexo: requiredSelect(['F', 'M']),
  edad_anios: nonNeg,
  grupo_edad: requiredSelect(['18_44', '45_59', '60_74', '75_mas']),
  regimen_afiliacion: requiredSelect([
    'Contributivo',
    'Especial',
    'Subsidiado',
  ]),
  nivel_educativo: requiredSelect([
    'Primaria',
    'Secundaria',
    'Sin_escolaridad',
    'Tecnico_tecnologico',
    'Universitario_posgrado',
  ]),
  estado_civil: requiredSelect([
    'Casado_union_libre',
    'Separado_viudo',
    'Soltero',
  ]),
  situacion_laboral: requiredSelect([
    'Desempleado',
    'Jubilado',
    'No_activo',
    'Ocupado',
  ]),
  personas_hogar: nonNeg,
  tipo_vivienda: requiredSelect(['Arriendo', 'Familiar_otro', 'Propia']),
  diabetes_tipo: requiredSelect(['Tipo_1', 'Tipo_2']),
  anios_desde_dx_diabetes: nonNeg,
  anios_desde_dx_hipertension: nonNeg,
  imc: positive,
  perimetro_abdominal_cm: positive,
  tabaquismo: requiredSelect(['Actual', 'Exfumador', 'Nunca']),
  cigarrillos_dia: nonNeg,
  alcohol_frecuencia: requiredSelect([
    'Diario',
    'Mensual_o_menor',
    'Nunca',
    'Semanal',
  ]),
  actividad_fisica_min_sem: nonNeg,
  calidad_dieta_0_100: z
    .number(numberMsg)
    .min(0, 'Debe estar entre 0 y 100')
    .max(100, 'Debe estar entre 0 y 100'),
  horas_sueno: nonNeg,
  estres_0_10: z
    .number(numberMsg)
    .min(0, 'Debe estar entre 0 y 10')
    .max(10, 'Debe estar entre 0 y 10'),
  consultas_atencion_primaria_12m: nonNeg,
  urgencias_12m: nonNeg,
  gasto_bolsillo_cop_mensual: nonNeg,
  tension_sistolica_mmhg: positive,
  tension_diastolica_mmhg: positive,
  hba1c_pct: positive,
  glucosa_ayunas_mg_dl: positive,
  colesterol_ldl_mg_dl: positive,
  trigliceridos_mg_dl: positive,
  egfr_ml_min_1_73m2: positive,
  albuminuria_categoria: requiredSelect(['A1', 'A2', 'A3']),
  medicamento_antidiabetico_principal: requiredSelect([
    'Insulina',
    'Metformina',
    'Metformina_DPP4',
    'Metformina_SGLT2',
    'Sulfonilurea',
  ]),
  usa_insulina: flag01,
  medicamento_antihipertensivo_principal: requiredSelect([
    'ARA_II',
    'Calcioantagonista',
    'Combinacion',
    'Diuretico',
    'IECA',
  ]),
  usa_estatina: flag01,
  comorbilidad_erc: flag01,
  comorbilidad_dislipidemia: flag01,
  comorbilidad_obesidad: flag01,
  complicacion_diabetes_previa: flag01,
  riesgo_cv_10_anios_pct: nonNeg,
  control_glucemico: flag01,
})

export type PatientFeatures = z.infer<typeof patientFeaturesSchema>
export type PatientFieldName = Extract<keyof PatientFeatures, string>
