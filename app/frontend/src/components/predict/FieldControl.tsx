import { useFormContext, type FieldError, type Path } from 'react-hook-form'

import type { FieldDef } from '../../lib/patientFormMeta'
import type { PatientFeatures } from '../../schemas/patient'

const inputClass =
  'w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20'
const labelClass = 'text-sm font-medium text-ink-muted'

function errorMessage(error: FieldError | undefined): string | null {
  if (!error) return null
  return error.message ?? 'Valor no válido'
}

function FieldHelp({ fieldId, text }: { fieldId: string; text: string }) {
  const tooltipId = `${fieldId}-help`
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-ink-faint ring-1 ring-line transition-colors hover:text-brand hover:ring-brand/40"
        aria-label="Más información"
        aria-describedby={tooltipId}
      >
        <span className="font-sans text-caption font-semibold" aria-hidden>
          ?
        </span>
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute top-full left-1/2 z-30 mt-1.5 hidden w-64 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-left text-xs font-normal leading-snug text-on-brand shadow-card group-hover:block group-focus-within:block sm:left-0 sm:translate-x-0"
      >
        {text}
      </span>
    </span>
  )
}

type FieldControlProps = {
  field: FieldDef
}

export function FieldControl({ field }: FieldControlProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFeatures>()

  const name = field.name as Path<PatientFeatures>
  const error = errorMessage(errors[name])
  const describedBy = [
    field.tooltip ? `${name}-help` : null,
    error ? `${name}-error` : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  return (
    <div className="space-y-1.5">
      <div className="flex items-center">
        <label htmlFor={name} className={labelClass}>
          {field.label}
        </label>
        {field.tooltip ? (
          <FieldHelp fieldId={name} text={field.tooltip} />
        ) : null}
      </div>

      {field.kind === 'select' ? (
        <select
          id={name}
          className={inputClass}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...register(name, {
            setValueAs: (v) => {
              if (field.options?.some((o) => typeof o.value === 'number')) {
                return v === '' ? v : Number(v)
              }
              return v
            },
          })}
        >
          <option value="">Selecciona una opción</option>
          {field.options?.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type="number"
          className={inputClass}
          min={field.min}
          max={field.max}
          step={field.step ?? 'any'}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...register(name, { valueAsNumber: true })}
        />
      )}

      {field.hint ? (
        <p className="font-mono text-caption text-ink-faint">{field.hint}</p>
      ) : null}
      {error ? (
        <p id={`${name}-error`} className="text-xs text-risk-high">
          {error}
        </p>
      ) : null}
    </div>
  )
}
