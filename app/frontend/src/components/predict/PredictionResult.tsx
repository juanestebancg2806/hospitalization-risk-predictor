import type { PredictionResponse } from '../../schemas/api'

type PredictionResultProps = {
  result: PredictionResponse
}

function riskTone(prob: number): {
  label: string
  pillClass: string
} {
  if (prob >= 0.4) {
    return {
      label: 'Riesgo alto',
      pillClass: 'bg-risk-high-soft text-risk-high',
    }
  }
  if (prob >= 0.2) {
    return {
      label: 'Riesgo medio',
      pillClass: 'bg-risk-mid-soft text-risk-mid',
    }
  }
  return {
    label: 'Riesgo bajo',
    pillClass: 'bg-risk-low-soft text-risk-low',
  }
}

export function PredictionResult({ result }: PredictionResultProps) {
  const pct = (result.probabilidad_hospitalizacion_12m * 100).toFixed(1)
  const tone = riskTone(result.probabilidad_hospitalizacion_12m)
  const positive = result.clase_predicha === 1

  return (
    <section className="space-y-3 rounded-2xl bg-surface-raised px-5 py-5 shadow-card ring-1 ring-line">
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
      <p className="text-4xl font-semibold tracking-tight text-ink tabular-nums">
        {pct}%
      </p>
      <p className="text-sm text-ink-muted">
        Probabilidad estimada de hospitalización en los próximos 12 meses.
      </p>
      <dl className="grid gap-1 border-t border-line pt-3 text-sm text-ink-muted sm:grid-cols-2">
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
