import type { PatientFieldName } from '../schemas/patient'

export type SelectOption = { value: string | number; label: string }

const FLAG_OPTIONS: SelectOption[] = [
  { value: 0, label: 'No' },
  { value: 1, label: 'Sí' },
]

export type FieldKind = 'number' | 'select'

export type FieldDef = {
  name: PatientFieldName
  label: string
  kind: FieldKind
  options?: SelectOption[]
  min?: number
  max?: number
  step?: number
  hint?: string
}

export type FormStep = {
  id: string
  title: string
  description: string
  fields: FieldDef[]
}

/** Multi-step grouping — 42 model inputs without a wall of fields. */
export const FORM_STEPS: FormStep[] = [
  {
    id: 'contexto',
    title: 'Datos sociodemográficos',
    description: 'Demografía y condiciones de vida.',
    fields: [
      {
        name: 'sexo',
        label: 'Sexo',
        kind: 'select',
        options: [
          { value: 'F', label: 'Femenino' },
          { value: 'M', label: 'Masculino' },
        ],
      },
      {
        name: 'edad_anios',
        label: 'Edad (años)',
        kind: 'number',
        min: 0,
        step: 1,
      },
      {
        name: 'grupo_edad',
        label: 'Grupo de edad',
        kind: 'select',
        options: [
          { value: '18_44', label: '18 a 44 años' },
          { value: '45_59', label: '45 a 59 años' },
          { value: '60_74', label: '60 a 74 años' },
          { value: '75_mas', label: '75 años o más' },
        ],
        hint: 'Debe coincidir con la edad.',
      },
      {
        name: 'regimen_afiliacion',
        label: 'Régimen de afiliación',
        kind: 'select',
        options: [
          { value: 'Contributivo', label: 'Contributivo' },
          { value: 'Especial', label: 'Especial' },
          { value: 'Subsidiado', label: 'Subsidiado' },
        ],
      },
      {
        name: 'nivel_educativo',
        label: 'Nivel educativo',
        kind: 'select',
        options: [
          { value: 'Sin_escolaridad', label: 'Sin escolaridad' },
          { value: 'Primaria', label: 'Primaria' },
          { value: 'Secundaria', label: 'Secundaria' },
          { value: 'Tecnico_tecnologico', label: 'Técnico o tecnológico' },
          { value: 'Universitario_posgrado', label: 'Universitario o posgrado' },
        ],
      },
      {
        name: 'estado_civil',
        label: 'Estado civil',
        kind: 'select',
        options: [
          { value: 'Soltero', label: 'Soltero(a)' },
          { value: 'Casado_union_libre', label: 'Casado(a) o unión libre' },
          { value: 'Separado_viudo', label: 'Separado(a) o viudo(a)' },
        ],
      },
      {
        name: 'situacion_laboral',
        label: 'Situación laboral',
        kind: 'select',
        options: [
          { value: 'Ocupado', label: 'Ocupado(a)' },
          { value: 'Desempleado', label: 'Desempleado(a)' },
          { value: 'Jubilado', label: 'Jubilado(a)' },
          { value: 'No_activo', label: 'No activo(a)' },
        ],
      },
      {
        name: 'personas_hogar',
        label: 'Personas en el hogar',
        kind: 'number',
        min: 0,
        step: 1,
      },
      {
        name: 'tipo_vivienda',
        label: 'Tipo de vivienda',
        kind: 'select',
        options: [
          { value: 'Propia', label: 'Propia' },
          { value: 'Arriendo', label: 'Arriendo' },
          { value: 'Familiar_otro', label: 'Familiar u otra' },
        ],
      },
    ],
  },
  {
    id: 'antecedentes',
    title: 'Antecedentes y hábitos',
    description: 'Diabetes, hipertensión, antropometría y estilo de vida.',
    fields: [
      {
        name: 'diabetes_tipo',
        label: 'Tipo de diabetes',
        kind: 'select',
        options: [
          { value: 'Tipo_1', label: 'Tipo 1' },
          { value: 'Tipo_2', label: 'Tipo 2' },
        ],
      },
      {
        name: 'anios_desde_dx_diabetes',
        label: 'Años desde el diagnóstico de diabetes',
        kind: 'number',
        min: 0,
        step: 0.5,
      },
      {
        name: 'anios_desde_dx_hipertension',
        label: 'Años desde el diagnóstico de hipertensión',
        kind: 'number',
        min: 0,
        step: 0.5,
      },
      {
        name: 'imc',
        label: 'Índice de masa corporal (IMC)',
        kind: 'number',
        min: 0.1,
        step: 0.1,
        hint: 'kg/m²',
      },
      {
        name: 'perimetro_abdominal_cm',
        label: 'Perímetro abdominal',
        kind: 'number',
        min: 0.1,
        step: 0.1,
        hint: 'Centímetros',
      },
      {
        name: 'tabaquismo',
        label: 'Tabaquismo',
        kind: 'select',
        options: [
          { value: 'Nunca', label: 'Nunca ha fumado' },
          { value: 'Exfumador', label: 'Exfumador(a)' },
          { value: 'Actual', label: 'Fumador(a) actual' },
        ],
      },
      {
        name: 'cigarrillos_dia',
        label: 'Cigarrillos al día',
        kind: 'number',
        min: 0,
        step: 1,
      },
      {
        name: 'alcohol_frecuencia',
        label: 'Consumo de alcohol',
        kind: 'select',
        options: [
          { value: 'Nunca', label: 'Nunca' },
          { value: 'Mensual_o_menor', label: 'Mensual o menos' },
          { value: 'Semanal', label: 'Semanal' },
          { value: 'Diario', label: 'Diario' },
        ],
      },
      {
        name: 'actividad_fisica_min_sem',
        label: 'Actividad física semanal',
        kind: 'number',
        min: 0,
        step: 5,
        hint: 'Minutos por semana',
      },
      {
        name: 'calidad_dieta_0_100',
        label: 'Calidad de la dieta',
        kind: 'number',
        min: 0,
        max: 100,
        step: 1,
        hint: 'Escala de 0 a 100',
      },
      {
        name: 'horas_sueno',
        label: 'Horas de sueño',
        kind: 'number',
        min: 0,
        step: 0.5,
        hint: 'Horas por noche',
      },
      {
        name: 'estres_0_10',
        label: 'Nivel de estrés',
        kind: 'number',
        min: 0,
        max: 10,
        step: 1,
        hint: 'Escala de 0 a 10',
      },
    ],
  },
  {
    id: 'clinica',
    title: 'Uso de servicios y clínica',
    description: 'Consultas, signos vitales y laboratorios.',
    fields: [
      {
        name: 'consultas_atencion_primaria_12m',
        label: 'Consultas de atención primaria',
        kind: 'number',
        min: 0,
        step: 1,
        hint: 'Últimos 12 meses',
      },
      {
        name: 'urgencias_12m',
        label: 'Visitas a urgencias',
        kind: 'number',
        min: 0,
        step: 1,
        hint: 'Últimos 12 meses',
      },
      {
        name: 'gasto_bolsillo_cop_mensual',
        label: 'Gasto de bolsillo mensual',
        kind: 'number',
        min: 0,
        step: 1000,
        hint: 'Pesos colombianos (COP)',
      },
      {
        name: 'tension_sistolica_mmhg',
        label: 'Tensión arterial sistólica',
        kind: 'number',
        min: 0.1,
        step: 1,
        hint: 'mmHg',
      },
      {
        name: 'tension_diastolica_mmhg',
        label: 'Tensión arterial diastólica',
        kind: 'number',
        min: 0.1,
        step: 1,
        hint: 'mmHg',
      },
      {
        name: 'hba1c_pct',
        label: 'Hemoglobina glicosilada (HbA1c)',
        kind: 'number',
        min: 0.1,
        step: 0.1,
        hint: 'Porcentaje',
      },
      {
        name: 'glucosa_ayunas_mg_dl',
        label: 'Glucosa en ayunas',
        kind: 'number',
        min: 0.1,
        step: 1,
        hint: 'mg/dL',
      },
      {
        name: 'colesterol_ldl_mg_dl',
        label: 'Colesterol LDL',
        kind: 'number',
        min: 0.1,
        step: 1,
        hint: 'mg/dL',
      },
      {
        name: 'trigliceridos_mg_dl',
        label: 'Triglicéridos',
        kind: 'number',
        min: 0.1,
        step: 1,
        hint: 'mg/dL',
      },
      {
        name: 'egfr_ml_min_1_73m2',
        label: 'Filtrado glomerular (eGFR)',
        kind: 'number',
        min: 0.1,
        step: 1,
        hint: 'mL/min/1.73 m²',
      },
      {
        name: 'albuminuria_categoria',
        label: 'Albuminuria',
        kind: 'select',
        options: [
          { value: 'A1', label: 'A1 — normal o ligeramente elevada' },
          { value: 'A2', label: 'A2 — moderadamente elevada' },
          { value: 'A3', label: 'A3 — gravemente elevada' },
        ],
      },
      {
        name: 'riesgo_cv_10_anios_pct',
        label: 'Riesgo cardiovascular a 10 años',
        kind: 'number',
        min: 0,
        step: 0.1,
        hint: 'Porcentaje',
      },
    ],
  },
  {
    id: 'tratamiento',
    title: 'Tratamiento y comorbilidades',
    description: 'Medicamentos, otras enfermedades y control glucémico.',
    fields: [
      {
        name: 'medicamento_antidiabetico_principal',
        label: 'Antidiabético principal',
        kind: 'select',
        options: [
          { value: 'Metformina', label: 'Metformina' },
          { value: 'Metformina_DPP4', label: 'Metformina + inhibidor DPP-4' },
          { value: 'Metformina_SGLT2', label: 'Metformina + inhibidor SGLT2' },
          { value: 'Sulfonilurea', label: 'Sulfonilurea' },
          { value: 'Insulina', label: 'Insulina' },
        ],
      },
      {
        name: 'usa_insulina',
        label: '¿Usa insulina?',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'medicamento_antihipertensivo_principal',
        label: 'Antihipertensivo principal',
        kind: 'select',
        options: [
          { value: 'IECA', label: 'IECA' },
          { value: 'ARA_II', label: 'ARA II' },
          { value: 'Calcioantagonista', label: 'Calcioantagonista' },
          { value: 'Diuretico', label: 'Diurético' },
          { value: 'Combinacion', label: 'Combinación' },
        ],
      },
      {
        name: 'usa_estatina',
        label: '¿Usa estatina?',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'comorbilidad_erc',
        label: '¿Enfermedad renal crónica?',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'comorbilidad_dislipidemia',
        label: '¿Dislipidemia?',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'comorbilidad_obesidad',
        label: '¿Obesidad?',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'complicacion_diabetes_previa',
        label: '¿Complicación previa de la diabetes?',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'control_glucemico',
        label: '¿Control glucémico adecuado?',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
    ],
  },
]

export const REVIEW_STEP_INDEX = FORM_STEPS.length

export function fieldNamesForStep(stepIndex: number): PatientFieldName[] {
  if (stepIndex < 0 || stepIndex >= FORM_STEPS.length) return []
  return FORM_STEPS[stepIndex].fields.map((f) => f.name)
}

const numberEs = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })
const currencyEs = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

/** Human-readable value for review — option labels, not encoder codes. */
export function formatFieldDisplay(field: FieldDef, value: unknown): string {
  if (value === '' || value === null || value === undefined) return '—'
  if (typeof value === 'number' && Number.isNaN(value)) return '—'

  const match = field.options?.find(
    (option) => option.value === value || String(option.value) === String(value),
  )
  if (match) return match.label

  if (typeof value === 'number') {
    if (field.name === 'gasto_bolsillo_cop_mensual') {
      return currencyEs.format(value)
    }
    return numberEs.format(value)
  }

  return String(value)
}
