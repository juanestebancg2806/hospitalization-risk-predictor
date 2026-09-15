import { TextLink } from '../components/ui/TextLink'
import { PredictWizard } from '../components/predict/PredictWizard'

/**
 * Multi-step patient form + optional example patient + prediction.
 * Orchestration lives in {@link usePredictWizard}.
 */
export function PredictPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <TextLink to="/">← Volver al inicio</TextLink>
        <h1>Evaluación de paciente</h1>
        <p className="max-w-xl text-base text-ink-muted">
          Completa las secciones o carga un paciente de ejemplo. Revisa los
          datos antes de calcular el riesgo a 12 meses.
        </p>
      </div>

      <PredictWizard />
    </div>
  )
}
