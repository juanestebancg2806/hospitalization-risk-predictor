import { useFormContext, type FieldError } from 'react-hook-form'

import type { FieldDef } from '../../lib/patientFormMeta'
import type { PatientFeatures } from '../../schemas/patient'

const inputClass =
  'w-full border border-line bg-surface-raised px-3 py-2 text-sm text-ink outline-none focus:border-brand'
const labelClass = 'block text-xs font-medium tracking-wide text-ink-muted'

function errorMessage(error: FieldError | undefined): string | null {
  if (!error) return null
  return error.message ?? 'Valor no válido'
}

type FieldControlProps = {
  field: FieldDef
}

export function FieldControl({ field }: FieldControlProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFeatures>()

  const error = errorMessage(errors[field.name])
  const describedBy = error ? `${field.name}-error` : undefined

  return (
    <div className="space-y-1.5">
      <label htmlFor={field.name} className={labelClass}>
        {field.label}
      </label>

      {field.kind === 'select' ? (
        <select
          id={field.name}
          className={inputClass}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...register(field.name, {
            setValueAs: (v) => {
              if (field.options?.some((o) => typeof o.value === 'number')) {
                return v === '' ? v : Number(v)
              }
              return v
            },
          })}
        >
          <option value="">Selecciona…</option>
          {field.options?.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={field.name}
          type="number"
          className={inputClass}
          min={field.min}
          max={field.max}
          step={field.step ?? 'any'}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...register(field.name, { valueAsNumber: true })}
        />
      )}

      {field.hint ? (
        <p className="font-mono text-[11px] text-ink-faint">{field.hint}</p>
      ) : null}
      {error ? (
        <p id={`${field.name}-error`} className="text-xs text-risk-high">
          {error}
        </p>
      ) : null}
    </div>
  )
}
