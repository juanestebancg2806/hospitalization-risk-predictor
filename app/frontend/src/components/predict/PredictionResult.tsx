import type { PredictionResponse } from '../../schemas/api'

type PredictionResultProps = {
  result: PredictionResponse
}

/** Mid/low split ≈ t_max_f1 in model meta. */
const T_MAX_F1 = 0.17
/** High-band fallback ≈ t_top15 / threshold_production when umbral_usado is missing. */
const T_TOP15 = 0.28

function riskTone(prob: number, highCutoff: number): {
  label: string
  pillClass: string
  cardClass: string
  valueClass: string
} {
  if (prob >= highCutoff) {
    return {
      label: 'Riesgo alto',
      pillClass: 'bg-surface-raised/80 text-risk-high',
      cardClass: 'bg-risk-high-soft ring-risk-high/30',
      valueClass: 'text-risk-high',
    }
  }
  if (prob >= T_MAX_F1) {
    return {
      label: 'Riesgo medio',
      pillClass: 'bg-surface-raised/80 text-risk-mid',
      cardClass: 'bg-risk-mid-soft ring-risk-mid/30',
      valueClass: 'text-risk-mid',
    }
  }
  return {
    label: 'Riesgo bajo',
    pillClass: 'bg-surface-raised/80 text-risk-low',
    cardClass: 'bg-risk-low-soft ring-risk-low/30',
    valueClass: 'text-risk-low',
  }
}

export function PredictionResult({ result }: PredictionResultProps) {
  const pct = (result.probabilidad_hospitalizacion_12m * 100).toFixed(1)
  const highCutoff =
    typeof result.umbral_usado === 'number' && Number.isFinite(result.umbral_usado)
      ? result.umbral_usado
      : T_TOP15
  const tone = riskTone(result.probabilidad_hospitalizacion_12m, highCutoff)
  const positive = result.clase_predicha === 1

  return (
    <section
      className={`space-y-3 rounded-2xl px-5 py-5 shadow-card ring-1 ${tone.cardClass}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-mono text-caption tracking-wide text-ink-faint uppercase">
          Resultado · horizonte 12 meses
        </p>
        <span
          className={`rounded-full px-2.5 py-0.5 font-mono text-caption font-medium ${tone.pillClass}`}
        >
          {tone.label}
        </span>
      </div>
      <p
        className={`text-4xl font-semibold tracking-tight tabular-nums ${tone.valueClass}`}
      >
        {pct}%
      </p>
      <p className="text-sm text-ink-muted">
        Probabilidad estimada de hospitalización en los próximos 12 meses.
      </p>
      <dl className="grid gap-1 border-t border-current/10 pt-3 text-sm text-ink-muted sm:grid-cols-2">
        <div>
          <dt className="inline text-ink-faint">Clasificación: </dt>
          <dd className="inline text-ink">
            {positive ? 'Priorizable' : 'No priorizable'}
          </dd>
        </div>
        <div>
          <dt className="inline text-ink-faint">Banda de riesgo: </dt>
          <dd className="inline text-ink">{tone.label}</dd>
        </div>
      </dl>
    </section>
  )
}
