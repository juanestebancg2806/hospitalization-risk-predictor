import { useWatch } from 'react-hook-form'

import {
  FORM_STEPS,
  formatFieldDisplay,
} from '../../lib/patientFormMeta'
import type { PatientFeatures } from '../../schemas/patient'

type PatientReviewProps = {
  exampleLoaded?: boolean
  onEditStep: (stepIndex: number) => void
}

/** Read-only summary of the form, grouped like the wizard steps. */
export function PatientReview({
  exampleLoaded = false,
  onEditStep,
}: PatientReviewProps) {
  const values = useWatch() as PatientFeatures

  return (
    <div className="space-y-6">
      {exampleLoaded ? (
        <p className="rounded-xl bg-brand-fog px-3 py-2 text-sm text-brand">
          Se cargó un paciente de ejemplo. Revisa los datos antes de calcular el
          riesgo.
        </p>
      ) : null}

      {FORM_STEPS.map((step, index) => (
        <section
          key={step.id}
          className={`space-y-3 ${index > 0 ? 'border-t border-line pt-5' : ''}`}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
            <button
              type="button"
              onClick={() => onEditStep(index)}
              className="shrink-0 text-xs font-medium text-brand hover:underline"
            >
              Editar
            </button>
          </div>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {step.fields.map((field) => (
              <div key={String(field.name)} className="min-w-0">
                <dt className="text-caption text-ink-faint">{field.label}</dt>
                <dd className="text-sm text-ink">
                  {formatFieldDisplay(field, values?.[field.name])}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
