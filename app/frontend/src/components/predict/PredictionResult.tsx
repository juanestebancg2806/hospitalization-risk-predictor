import type { PredictionResponse } from '../../schemas/api'

type PredictionResultProps = {
  result: PredictionResponse
}

function riskTone(prob: number): {
  label: string
  className: string
} {
  if (prob >= 0.4) {
    return {
      label: 'Banda alta (referencia MVP)',
      className: 'border-risk-high bg-risk-high-soft text-risk-high',
    }
  }
  if (prob >= 0.2) {
    return {
      label: 'Banda media (referencia MVP)',
      className: 'border-risk-mid bg-risk-mid-soft text-risk-mid',
    }
  }
  return {
    label: 'Banda baja (referencia MVP)',
    className: 'border-risk-low bg-risk-low-soft text-risk-low',
  }
}

export function PredictionResult({ result }: PredictionResultProps) {
  const pct = (result.probabilidad_hospitalizacion_12m * 100).toFixed(1)
  const tone = riskTone(result.probabilidad_hospitalizacion_12m)
  const positive = result.clase_predicha === 1

  return (
    <section className={`space-y-3 border-l-4 px-4 py-4 ${tone.className}`}>
      <p className="font-mono text-[11px] tracking-wide uppercase">
        Resultado · horizonte 12 meses
      </p>
      <p className="text-4xl font-semibold tracking-tight tabular-nums">
        {pct}%
      </p>
      <p className="text-sm opacity-90">
        Probabilidad de hospitalización estimada por el pipeline.
      </p>
      <dl className="grid gap-1 border-t border-current/20 pt-3 font-mono text-xs sm:grid-cols-2">
        <div>
          <dt className="inline opacity-70">clase_predicha: </dt>
          <dd className="inline">
            {result.clase_predicha}{' '}
            ({positive ? 'positivo / priorizable' : 'negativo'})
          </dd>
        </div>
        <div>
          <dt className="inline opacity-70">umbral_usado: </dt>
          <dd className="inline">{result.umbral_usado.toFixed(4)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="inline opacity-70">interpretación UI: </dt>
          <dd className="inline">{tone.label}</dd>
        </div>
      </dl>
    </section>
  )
}
