"""Prediction request/response schemas."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class PatientFeatures(BaseModel):
    """Raw patient features expected by the trained pipeline (42 columns)."""

    sexo: Literal["F", "M"]
    edad_anios: float = Field(ge=0)
    grupo_edad: Literal["18_44", "45_59", "60_74", "75_mas"]
    regimen_afiliacion: Literal["Contributivo", "Especial", "Subsidiado"]
    nivel_educativo: Literal[
        "Primaria",
        "Secundaria",
        "Sin_escolaridad",
        "Tecnico_tecnologico",
        "Universitario_posgrado",
    ]
    estado_civil: Literal["Casado_union_libre", "Separado_viudo", "Soltero"]
    situacion_laboral: Literal["Desempleado", "Jubilado", "No_activo", "Ocupado"]
    personas_hogar: float = Field(ge=0)
    tipo_vivienda: Literal["Arriendo", "Familiar_otro", "Propia"]
    diabetes_tipo: Literal["Tipo_1", "Tipo_2"]
    anios_desde_dx_diabetes: float = Field(ge=0)
    anios_desde_dx_hipertension: float = Field(ge=0)
    imc: float = Field(gt=0)
    perimetro_abdominal_cm: float = Field(gt=0)
    tabaquismo: Literal["Actual", "Exfumador", "Nunca"]
    cigarrillos_dia: float = Field(ge=0)
    alcohol_frecuencia: Literal["Diario", "Mensual_o_menor", "Nunca", "Semanal"]
    actividad_fisica_min_sem: float = Field(ge=0)
    calidad_dieta_0_100: float = Field(ge=0, le=100)
    horas_sueno: float = Field(ge=0)
    estres_0_10: float = Field(ge=0, le=10)
    consultas_atencion_primaria_12m: float = Field(ge=0)
    urgencias_12m: float = Field(ge=0)
    gasto_bolsillo_cop_mensual: float = Field(ge=0)
    tension_sistolica_mmhg: float = Field(gt=0)
    tension_diastolica_mmhg: float = Field(gt=0)
    hba1c_pct: float = Field(gt=0)
    glucosa_ayunas_mg_dl: float = Field(gt=0)
    colesterol_ldl_mg_dl: float = Field(gt=0)
    trigliceridos_mg_dl: float = Field(gt=0)
    egfr_ml_min_1_73m2: float = Field(gt=0)
    albuminuria_categoria: Literal["A1", "A2", "A3"]
    medicamento_antidiabetico_principal: Literal[
        "Insulina",
        "Metformina",
        "Metformina_DPP4",
        "Metformina_SGLT2",
        "Sulfonilurea",
    ]
    usa_insulina: Literal[0, 1]
    medicamento_antihipertensivo_principal: Literal[
        "ARA_II",
        "Calcioantagonista",
        "Combinacion",
        "Diuretico",
        "IECA",
    ]
    usa_estatina: Literal[0, 1]
    comorbilidad_erc: Literal[0, 1]
    comorbilidad_dislipidemia: Literal[0, 1]
    comorbilidad_obesidad: Literal[0, 1]
    complicacion_diabetes_previa: Literal[0, 1]
    riesgo_cv_10_anios_pct: float = Field(ge=0)
    control_glucemico: Literal[0, 1]


class PredictionResponse(BaseModel):
    probabilidad_hospitalizacion_12m: float
    clase_predicha: int
