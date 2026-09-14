import type { PatientFeatures } from '../schemas/patient'

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function rand(min: number, max: number, decimals = 0): number {
  const n = Math.random() * (max - min) + min
  const f = 10 ** decimals
  return Math.round(n * f) / f
}

function grupoEdadFromAge(age: number): PatientFeatures['grupo_edad'] {
  if (age < 45) return '18_44'
  if (age < 60) return '45_59'
  if (age < 75) return '60_74'
  return '75_mas'
}

/**
 * Synthetic but coherent patient for easy API testing.
 * Categories match the trained encoder; numeric ranges are clinically plausible MVP ranges.
 */
export function createRandomPatient(): PatientFeatures {
  const edad = rand(22, 88)
  const tabaquismo = pick(['Actual', 'Exfumador', 'Nunca'] as const)
  const antiDiab = pick([
    'Insulina',
    'Metformina',
    'Metformina_DPP4',
    'Metformina_SGLT2',
    'Sulfonilurea',
  ] as const)
  const usaInsulina: 0 | 1 =
    antiDiab === 'Insulina' ? 1 : pick([0, 1] as const)
  const imc = rand(22, 38, 1)

  return {
    sexo: pick(['F', 'M'] as const),
    edad_anios: edad,
    grupo_edad: grupoEdadFromAge(edad),
    regimen_afiliacion: pick([
      'Contributivo',
      'Especial',
      'Subsidiado',
    ] as const),
    nivel_educativo: pick([
      'Primaria',
      'Secundaria',
      'Sin_escolaridad',
      'Tecnico_tecnologico',
      'Universitario_posgrado',
    ] as const),
    estado_civil: pick([
      'Casado_union_libre',
      'Separado_viudo',
      'Soltero',
    ] as const),
    situacion_laboral: pick([
      'Desempleado',
      'Jubilado',
      'No_activo',
      'Ocupado',
    ] as const),
    personas_hogar: rand(1, 6),
    tipo_vivienda: pick(['Arriendo', 'Familiar_otro', 'Propia'] as const),
    diabetes_tipo: pick(['Tipo_1', 'Tipo_2'] as const),
    anios_desde_dx_diabetes: rand(1, 25, 1),
    anios_desde_dx_hipertension: rand(1, 30, 1),
    imc,
    perimetro_abdominal_cm: rand(75, 120, 1),
    tabaquismo,
    cigarrillos_dia: tabaquismo === 'Actual' ? rand(2, 25) : 0,
    alcohol_frecuencia: pick([
      'Diario',
      'Mensual_o_menor',
      'Nunca',
      'Semanal',
    ] as const),
    actividad_fisica_min_sem: rand(0, 300, 0),
    calidad_dieta_0_100: rand(20, 90),
    horas_sueno: rand(4, 9, 1),
    estres_0_10: rand(0, 10),
    consultas_atencion_primaria_12m: rand(0, 12),
    urgencias_12m: rand(0, 5),
    gasto_bolsillo_cop_mensual: rand(0, 250) * 1000,
    tension_sistolica_mmhg: rand(110, 175),
    tension_diastolica_mmhg: rand(65, 105),
    hba1c_pct: rand(5.5, 11, 1),
    glucosa_ayunas_mg_dl: rand(90, 220),
    colesterol_ldl_mg_dl: rand(70, 190),
    trigliceridos_mg_dl: rand(80, 320),
    egfr_ml_min_1_73m2: rand(35, 110),
    albuminuria_categoria: pick(['A1', 'A2', 'A3'] as const),
    medicamento_antidiabetico_principal: antiDiab,
    usa_insulina: usaInsulina,
    medicamento_antihipertensivo_principal: pick([
      'ARA_II',
      'Calcioantagonista',
      'Combinacion',
      'Diuretico',
      'IECA',
    ] as const),
    usa_estatina: pick([0, 1] as const),
    comorbilidad_erc: pick([0, 1] as const),
    comorbilidad_dislipidemia: pick([0, 1] as const),
    comorbilidad_obesidad: imc >= 30 ? 1 : pick([0, 1] as const),
    complicacion_diabetes_previa: pick([0, 1] as const),
    riesgo_cv_10_anios_pct: rand(2, 45, 1),
    control_glucemico: pick([0, 1] as const),
  }
}
