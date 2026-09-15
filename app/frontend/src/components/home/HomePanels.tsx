import { PrimaryButtonLink } from '../ui/PrimaryButtonLink'
import { ApiErrorDetails, StatusBanner } from '../feedback/StatusBanner'
import type { BackendStatusState } from '../../api/types'

type BackendStatusPanelProps = {
  status: BackendStatusState
  onRetry: () => void
}

export function BackendStatusPanel({
  status,
  onRetry,
}: BackendStatusPanelProps) {
  if (status.kind === 'loading') {
    return (
      <StatusBanner tone="neutral" title="Comprobando disponibilidad…" />
    )
  }

  if (status.kind === 'error') {
    return (
      <StatusBanner
        tone="danger"
        title="Servicio no disponible"
        actionLabel="Reintentar"
        onAction={onRetry}
      >
        <ApiErrorDetails error={status.error} />
      </StatusBanner>
    )
  }

  const modelOk = status.health.model_loaded

  return (
    <StatusBanner
      tone={modelOk ? 'ok' : 'warn'}
      title={
        modelOk
          ? 'La evaluación está disponible'
          : 'La evaluación no está disponible'
      }
      actionLabel="Actualizar"
      onAction={onRetry}
    >
      <p>
        {modelOk
          ? 'Puedes registrar un paciente y calcular su riesgo a 12 meses.'
          : 'Inténtalo de nuevo en unos minutos.'}
      </p>
    </StatusBanner>
  )
}

type HomeIntroProps = {
  canPredict: boolean
}

export function HomeIntro({ canPredict }: HomeIntroProps) {
  return (
    <section className="space-y-6">
      <p className="inline-flex rounded-full bg-brand-fog px-3 py-1 font-mono text-caption font-medium tracking-wide text-brand uppercase">
        Herramienta de apoyo clínico
      </p>
      <div className="space-y-3">
        <h1 className="max-w-xl">
          Estimar el riesgo de hospitalización a 12 meses
        </h1>
        <p className="max-w-xl text-base text-ink-muted">
          Completa el perfil clínico y demográfico del paciente. Recibirás una
          probabilidad de hospitalización en el siguiente año y una banda de
          riesgo para apoyar la priorización.
        </p>
      </div>

      <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        {[
          '01 Completar el formulario',
          '02 Revisar el resumen',
          '03 Calcular el riesgo',
        ].map((item) => (
          <li
            key={item}
            className="rounded-full bg-surface-raised px-3 py-1.5 font-mono text-caption text-ink-muted shadow-sm ring-1 ring-line"
          >
            {item}
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <PrimaryButtonLink to="/predict" disabled={!canPredict}>
          Iniciar evaluación
        </PrimaryButtonLink>
        <p className="max-w-xs text-xs text-ink-faint">
          {canPredict
            ? 'El servicio está listo para evaluar pacientes.'
            : 'Espera a que el servicio esté disponible para continuar.'}
        </p>
      </div>
    </section>
  )
}
