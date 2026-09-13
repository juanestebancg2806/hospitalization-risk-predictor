import { useWatch } from 'react-hook-form'

import type { PatientFeatures } from '../../schemas/patient'
import { Button } from '../ui/Button'

type PayloadPreviewProps = {
  /** When true, emphasize that this came from the random generator. */
  highlightRandom?: boolean
  onClearHighlight?: () => void
}

/** Live JSON of the patient payload (esp. after random fill). */
export function PayloadPreview({
  highlightRandom = false,
  onClearHighlight,
}: PayloadPreviewProps) {
  const payload = useWatch() as PatientFeatures
  const json = JSON.stringify(payload ?? {}, null, 2)

  return (
    <section
      className={`space-y-3 border-l-4 px-4 py-3 ${
        highlightRandom
          ? 'border-brand bg-brand-fog'
          : 'border-line-strong bg-surface'
      }`}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-wide text-ink-faint uppercase">
            {highlightRandom ? 'Paciente aleatorio' : 'Payload actual'}
          </p>
          <h2 className="text-sm font-semibold text-ink">
            {highlightRandom
              ? 'Se generó un payload de prueba y se cargó en el formulario'
              : 'Cuerpo JSON que se enviará a POST /predict'}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            className="!px-2 !py-1 font-mono text-[11px] uppercase"
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(json)
            }}
          >
            Copiar JSON
          </Button>
          {highlightRandom && onClearHighlight ? (
            <Button
              variant="ghost"
              className="!px-2 !py-1 font-mono text-[11px]"
              type="button"
              onClick={onClearHighlight}
            >
              Entendido
            </Button>
          ) : null}
        </div>
      </div>
      <pre className="max-h-72 overflow-auto border border-line bg-surface-raised p-3 font-mono text-[11px] leading-relaxed text-ink">
        {json}
      </pre>
    </section>
  )
}
