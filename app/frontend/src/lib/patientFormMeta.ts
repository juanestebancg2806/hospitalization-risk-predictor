import type { PatientFeatures } from '../schemas/patient'

/** Categories learned by the trained OneHotEncoder (exact strings). */
export const DEPARTAMENTOS = [
  'Antioquia',
  'Atlántico',
  'Bogotá D.C.',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Cauca',
  'Cesar',
  'Cundinamarca',
  'Córdoba',
  'Huila',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Risaralda',
  'Santander',
  'Tolima',
  'Valle del Cauca',
] as const

export type SelectOption = { value: string | number; label: string }

function opts(values: readonly string[]): SelectOption[] {
  return values.map((value) => ({
    value,
    label: value.replaceAll('_', ' '),
  }))
}

const FLAG_OPTIONS: SelectOption[] = [
  { value: 0, label: 'No (0)' },
  { value: 1, label: 'Sí (1)' },
]

export type FieldKind = 'number' | 'select'

export type FieldDef = {
  name: keyof PatientFeatures
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

/** Multi-step grouping — keeps the 45 fields usable without a wall of inputs. */
export const FORM_STEPS: FormStep[] = [
  {
    id: 'contexto',
    title: 'Contexto sociodemográfico',
    description: 'Ubicación, demografía y condiciones de vida.',
    fields: [
      {
        name: 'departamento',
        label: 'Departamento',
        kind: 'select',
        options: opts(DEPARTAMENTOS),
      },
      {
        name: 'zona',
        label: 'Zona',
        kind: 'select',
        options: opts(['Rural', 'Urbana']),
      },
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
        options: opts(['18_44', '45_59', '60_74', '75_mas']),
        hint: 'Debe ser coherente con la edad.',
      },
      {
        name: 'nivel_socioeconomico',
        label: 'Nivel socioeconómico',
        kind: 'select',
        options: opts(['Alto', 'Bajo', 'Medio']),
      },
      {
        name: 'regimen_afiliacion',
        label: 'Régimen de afiliación',
        kind: 'select',
        options: opts(['Contributivo', 'Especial', 'Subsidiado']),
      },
      {
        name: 'nivel_educativo',
        label: 'Nivel educativo',
        kind: 'select',
        options: opts([
          'Primaria',
          'Secundaria',
          'Sin_escolaridad',
          'Tecnico_tecnologico',
          'Universitario_posgrado',
        ]),
      },
      {
        name: 'estado_civil',
        label: 'Estado civil',
        kind: 'select',
        options: opts(['Casado_union_libre', 'Separado_viudo', 'Soltero']),
      },
      {
        name: 'situacion_laboral',
        label: 'Situación laboral',
        kind: 'select',
        options: opts(['Desempleado', 'Jubilado', 'No_activo', 'Ocupado']),
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
        options: opts(['Arriendo', 'Familiar_otro', 'Propia']),
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
        options: opts(['Tipo_1', 'Tipo_2']),
      },
      {
        name: 'anios_desde_dx_diabetes',
        label: 'Años desde dx diabetes',
        kind: 'number',
        min: 0,
        step: 0.5,
      },
      {
        name: 'anios_desde_dx_hipertension',
        label: 'Años desde dx hipertensión',
        kind: 'number',
        min: 0,
        step: 0.5,
      },
      { name: 'imc', label: 'IMC', kind: 'number', min: 0.1, step: 0.1 },
      {
        name: 'perimetro_abdominal_cm',
        label: 'Perímetro abdominal (cm)',
        kind: 'number',
        min: 0.1,
        step: 0.1,
      },
      {
        name: 'tabaquismo',
        label: 'Tabaquismo',
        kind: 'select',
        options: opts(['Actual', 'Exfumador', 'Nunca']),
      },
      {
        name: 'cigarrillos_dia',
        label: 'Cigarrillos / día',
        kind: 'number',
        min: 0,
        step: 1,
      },
      {
        name: 'alcohol_frecuencia',
        label: 'Frecuencia de alcohol',
        kind: 'select',
        options: opts(['Diario', 'Mensual_o_menor', 'Nunca', 'Semanal']),
      },
      {
        name: 'actividad_fisica_min_sem',
        label: 'Actividad física (min/sem)',
        kind: 'number',
        min: 0,
        step: 5,
      },
      {
        name: 'calidad_dieta_0_100',
        label: 'Calidad de dieta (0–100)',
        kind: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
      {
        name: 'horas_sueno',
        label: 'Horas de sueño',
        kind: 'number',
        min: 0,
        step: 0.5,
      },
      {
        name: 'estres_0_10',
        label: 'Estrés (0–10)',
        kind: 'number',
        min: 0,
        max: 10,
        step: 1,
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
        label: 'Consultas APS (12m)',
        kind: 'number',
        min: 0,
        step: 1,
      },
      {
        name: 'urgencias_12m',
        label: 'Urgencias (12m)',
        kind: 'number',
        min: 0,
        step: 1,
      },
      {
        name: 'gasto_bolsillo_cop_mensual',
        label: 'Gasto de bolsillo (COP/mes)',
        kind: 'number',
        min: 0,
        step: 1000,
      },
      {
        name: 'tension_sistolica_mmhg',
        label: 'Tensión sistólica (mmHg)',
        kind: 'number',
        min: 0.1,
        step: 1,
      },
      {
        name: 'tension_diastolica_mmhg',
        label: 'Tensión diastólica (mmHg)',
        kind: 'number',
        min: 0.1,
        step: 1,
      },
      {
        name: 'hba1c_pct',
        label: 'HbA1c (%)',
        kind: 'number',
        min: 0.1,
        step: 0.1,
      },
      {
        name: 'glucosa_ayunas_mg_dl',
        label: 'Glucosa en ayunas (mg/dL)',
        kind: 'number',
        min: 0.1,
        step: 1,
      },
      {
        name: 'colesterol_ldl_mg_dl',
        label: 'Colesterol LDL (mg/dL)',
        kind: 'number',
        min: 0.1,
        step: 1,
      },
      {
        name: 'trigliceridos_mg_dl',
        label: 'Triglicéridos (mg/dL)',
        kind: 'number',
        min: 0.1,
        step: 1,
      },
      {
        name: 'egfr_ml_min_1_73m2',
        label: 'eGFR (mL/min/1.73m²)',
        kind: 'number',
        min: 0.1,
        step: 1,
      },
      {
        name: 'albuminuria_categoria',
        label: 'Albuminuria',
        kind: 'select',
        options: opts(['A1', 'A2', 'A3']),
      },
      {
        name: 'riesgo_cv_10_anios_pct',
        label: 'Riesgo CV 10 años (%)',
        kind: 'number',
        min: 0,
        step: 0.1,
      },
    ],
  },
  {
    id: 'tratamiento',
    title: 'Tratamiento y comorbilidades',
    description: 'Medicamentos, comorbilidades y control glucémico.',
    fields: [
      {
        name: 'medicamento_antidiabetico_principal',
        label: 'Antidiabético principal',
        kind: 'select',
        options: opts([
          'Insulina',
          'Metformina',
          'Metformina_DPP4',
          'Metformina_SGLT2',
          'Sulfonilurea',
        ]),
      },
      {
        name: 'usa_insulina',
        label: 'Usa insulina',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'medicamento_antihipertensivo_principal',
        label: 'Antihipertensivo principal',
        kind: 'select',
        options: opts([
          'ARA_II',
          'Calcioantagonista',
          'Combinacion',
          'Diuretico',
          'IECA',
        ]),
      },
      {
        name: 'usa_estatina',
        label: 'Usa estatina',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'comorbilidad_erc',
        label: 'Comorbilidad ERC',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'comorbilidad_dislipidemia',
        label: 'Comorbilidad dislipidemia',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'comorbilidad_obesidad',
        label: 'Comorbilidad obesidad',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'complicacion_diabetes_previa',
        label: 'Complicación diabetes previa',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
      {
        name: 'control_glucemico',
        label: 'Control glucémico',
        kind: 'select',
        options: FLAG_OPTIONS,
      },
    ],
  },
]

export const REVIEW_STEP_INDEX = FORM_STEPS.length

export function fieldNamesForStep(stepIndex: number): (keyof PatientFeatures)[] {
  if (stepIndex < 0 || stepIndex >= FORM_STEPS.length) return []
  return FORM_STEPS[stepIndex].fields.map((f) => f.name)
}
