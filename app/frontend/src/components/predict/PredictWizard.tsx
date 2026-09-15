import { FormProvider } from 'react-hook-form'

import { FORM_STEPS, REVIEW_STEP_INDEX } from '../../lib/patientFormMeta'
import { usePredictWizard } from '../../hooks/usePredictWizard'
import { ApiErrorDetails, StatusBanner } from '../feedback/StatusBanner'
import { Button } from '../ui/Button'
import { FieldControl } from './FieldControl'
import { PatientReview } from './PatientReview'
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
  } = wizard

  return (
    <FormProvider {...form}>
      <form className="space-y-8" onSubmit={submit} noValidate>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-caption tracking-wide text-ink-faint uppercase">
            Paso {stepIndex + 1} de {totalSteps}
          </p>
          <Button variant="secondary" type="button" onClick={fillRandom}>
            Cargar paciente de ejemplo
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
                className={`rounded-full px-3 py-1 font-mono text-caption ring-1 transition-colors ${
                  active
                    ? 'bg-brand-fog text-brand ring-brand/30'
                    : done
                      ? 'bg-surface-raised text-ink-muted ring-line'
                      : 'bg-transparent text-ink-faint ring-line'
                }`}
              >
                {String(index + 1).padStart(2, '0')} · {step.title}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setStepIndex(REVIEW_STEP_INDEX)}
            className={`rounded-full px-3 py-1 font-mono text-caption ring-1 transition-colors ${
              isReview
                ? 'bg-brand-fog text-brand ring-brand/30'
                : 'bg-transparent text-ink-faint ring-line'
            }`}
          >
            {String(totalSteps).padStart(2, '0')} · Revisión
          </button>
        </nav>

        {!isReview && currentStep ? (
          <section className="space-y-5 rounded-2xl bg-surface-raised p-5 shadow-card ring-1 ring-line">
            <header className="space-y-1">
              <h2>{currentStep.title}</h2>
              <p className="text-sm text-ink-muted">{currentStep.description}</p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              {currentStep.fields.map((field) => (
                <FieldControl key={String(field.name)} field={field} />
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-6 rounded-2xl bg-surface-raised p-5 shadow-card ring-1 ring-line">
            <header className="space-y-1">
              <h2>Revisión</h2>
              <p className="text-sm text-ink-muted">
                Confirma los datos del paciente. Puedes editar una sección o
                calcular el riesgo.
              </p>
            </header>

            <PatientReview
              exampleLoaded={highlightRandom}
              onEditStep={setStepIndex}
            />

            {submitError ? (
              <StatusBanner tone="danger" title="No se pudo calcular el riesgo">
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
                {isSubmitting ? 'Calculando…' : 'Calcular riesgo'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
