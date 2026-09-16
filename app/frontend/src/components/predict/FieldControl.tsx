import { useFormContext, type FieldError, type Path } from 'react-hook-form'

import type { FieldDef } from '../../lib/patientFormMeta'
import type { PatientFeatures } from '../../schemas/patient'
import { FieldHelp } from './FieldHelp'

const inputClass =
  'w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20'
const labelClass = 'text-sm font-medium text-ink-muted'

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

  const name = field.name as Path<PatientFeatures>
  const error = errorMessage(errors[name])
  const describedBy = error ? `${name}-error` : undefined

  return (
    <div className="space-y-1.5">
      <div className="flex items-center">
        <label htmlFor={name} className={labelClass}>
          {field.label}
        </label>
        {field.tooltip ? <FieldHelp text={field.tooltip} /> : null}
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
