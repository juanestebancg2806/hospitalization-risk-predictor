import { FormProvider } from 'react-hook-form'

import { FORM_STEPS, REVIEW_STEP_INDEX } from '../../lib/patientFormMeta'
import { usePredictWizard } from '../../hooks/usePredictWizard'
import { ApiErrorDetails, StatusBanner } from '../feedback/StatusBanner'
import { Button } from '../ui/Button'
import { FieldControl } from './FieldControl'
import { PayloadPreview } from './PayloadPreview'
import { PredictionResult } from './PredictionResult'

export function PredictWizard() {
  const wizard = usePredictWizard()
  const {
    form,
    stepIndex,
    setStepIndex,
    isReview,
    totalSteps,
    currentStep,
    fillRandom,
    goNext,
    goBack,
    submit,
    isSubmitting,
    submitError,
    result,
    highlightRandom,
    clearRandomHighlight,
  } = wizard

  return (
    <FormProvider {...form}>
      <form className="space-y-8" onSubmit={submit} noValidate>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-wide text-ink-faint uppercase">
            Paso {stepIndex + 1} de {totalSteps}
          </p>
          <Button variant="secondary" type="button" onClick={fillRandom}>
            Generar paciente aleatorio
          </Button>
        </div>

        <nav aria-label="Progreso del formulario" className="flex flex-wrap gap-2">
          {FORM_STEPS.map((step, index) => {
            const active = index === stepIndex
            const done = index < stepIndex
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setStepIndex(index)}
                className={`border px-2 py-1 font-mono text-[11px] ${
                  active
                    ? 'border-brand bg-brand-fog text-brand'
                    : done
                      ? 'border-line text-ink-muted'
                      : 'border-line text-ink-faint'
                }`}
              >
                {String(index + 1).padStart(2, '0')} · {step.title}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setStepIndex(REVIEW_STEP_INDEX)}
            className={`border px-2 py-1 font-mono text-[11px] ${
              isReview
                ? 'border-brand bg-brand-fog text-brand'
                : 'border-line text-ink-faint'
            }`}
          >
            {String(totalSteps).padStart(2, '0')} · Revisión
          </button>
        </nav>

        {(highlightRandom || isReview) && (
          <PayloadPreview
            highlightRandom={highlightRandom}
            onClearHighlight={clearRandomHighlight}
          />
        )}

        {!isReview && currentStep ? (
          <section className="space-y-5">
            <header className="space-y-1 border-l-2 border-brand pl-4">
              <h2 className="text-xl font-semibold tracking-tight">
                {currentStep.title}
              </h2>
              <p className="text-sm text-ink-muted">{currentStep.description}</p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              {currentStep.fields.map((field) => (
                <FieldControl key={field.name} field={field} />
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            <header className="space-y-1 border-l-2 border-brand pl-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Revisión y predicción
              </h2>
              <p className="text-sm text-ink-muted">
                Verifica el payload arriba. Puedes volver a cualquier paso para
                editar, o enviar al modelo.
              </p>
            </header>

            {submitError ? (
              <StatusBanner tone="danger" title="No se pudo predecir">
                <ApiErrorDetails error={submitError} />
              </StatusBanner>
            ) : null}

            {result ? <PredictionResult result={result} /> : null}
          </section>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <Button
            variant="ghost"
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0 || isSubmitting}
          >
            ← Anterior
          </Button>

          <div className="flex flex-wrap gap-2">
            {!isReview ? (
              <Button type="button" onClick={() => void goNext()}>
                Siguiente →
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Calculando…' : 'Obtener predicción'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
