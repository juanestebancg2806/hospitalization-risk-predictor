import { TextLink } from '../components/ui/TextLink'
import { PredictWizard } from '../components/predict/PredictWizard'
import { MvpScopeNote } from '../components/home/HomePanels'

/**
 * Multi-step patient form + random sample + prediction.
 * Orchestration lives in {@link usePredictWizard}.
 */
export function PredictPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 border-l-2 border-brand pl-5">
        <TextLink to="/">← Volver al inicio</TextLink>
        <h1 className="text-3xl font-semibold tracking-tight">
          Evaluación de paciente
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-ink-muted">
          Completa las secciones o genera un paciente aleatorio para probar el
          endpoint. El JSON enviado al API se muestra de forma explícita.
        </p>
      </div>

      <PredictWizard />
      <MvpScopeNote />
    </div>
  )
}
