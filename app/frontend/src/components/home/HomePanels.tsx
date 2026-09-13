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
      <StatusBanner tone="neutral" title="Comprobando servicio…">
        <p className="font-mono text-xs">GET /health</p>
      </StatusBanner>
    )
  }

  if (status.kind === 'error') {
    return (
      <StatusBanner
        tone="danger"
        title="Backend no disponible"
        actionLabel="Reintentar"
        onAction={onRetry}
      >
        <ApiErrorDetails error={status.error} />
      </StatusBanner>
    )
  }

  const { health } = status
  const modelOk = health.model_loaded

  return (
    <StatusBanner
      tone={modelOk ? 'ok' : 'warn'}
      title={modelOk ? 'Servicio listo' : 'Servicio degradado'}
      actionLabel="Actualizar"
      onAction={onRetry}
    >
      <dl className="grid gap-1 font-mono text-xs sm:grid-cols-2">
        <div>
          <dt className="inline text-ink-faint">status: </dt>
          <dd className="inline">{health.status}</dd>
        </div>
        <div>
          <dt className="inline text-ink-faint">modelo: </dt>
          <dd className="inline">{modelOk ? 'cargado' : 'no cargado'}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="inline text-ink-faint">ruta: </dt>
          <dd className="inline break-all">{health.model_path}</dd>
        </div>
      </dl>
    </StatusBanner>
  )
}

type HomeIntroProps = {
  canPredict: boolean
}

export function HomeIntro({ canPredict }: HomeIntroProps) {
  return (
    <section className="space-y-6 border-l-2 border-brand pl-5">
      <div className="space-y-3">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Estimar el riesgo de hospitalización a 12 meses
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-ink-muted">
          Herramienta de apoyo para priorizar pacientes con diabetes e
          hipertensión. Ingresas variables clínicas y demográficas; el modelo
          devuelve una probabilidad de hospitalización en el siguiente año.
        </p>
      </div>

      <ol className="space-y-2 border-t border-line pt-5 font-mono text-xs text-ink-muted">
        <li>01 — Completar el formulario por secciones</li>
        <li>02 — Revisar el resumen del paciente</li>
        <li>03 — Obtener probabilidad y banda de riesgo</li>
      </ol>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <PrimaryButtonLink to="/predict" disabled={!canPredict}>
          Iniciar evaluación
        </PrimaryButtonLink>
        <p className="max-w-xs text-xs text-ink-faint">
          {canPredict
            ? 'El API responde y el modelo está cargado.'
            : 'Espera a que el backend esté disponible para continuar.'}
        </p>
      </div>
    </section>
  )
}

export function MvpScopeNote() {
  return (
    <aside className="border-l-4 border-line-strong bg-surface px-4 py-3 text-sm text-ink-muted">
      <p className="font-medium text-ink">Alcance del MVP</p>
      <p className="mt-1 leading-relaxed">
        El modelo es un pipeline de regresión logística entrenado sobre datos
        sintéticos. La métrica de negocio (precisión en el top de riesgo) aún no
        alcanza la meta clínica del proyecto; úsalo como demostración del flujo
        extremo a extremo, no como decisión clínica.
      </p>
    </aside>
  )
}
