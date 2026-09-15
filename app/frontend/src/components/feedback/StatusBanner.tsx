import type { ReactNode } from 'react'

import type { ApiClientError } from '../../api/errors'

type Tone = 'neutral' | 'ok' | 'warn' | 'danger'

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-raised text-ink-muted ring-line',
  ok: 'bg-risk-low-soft text-risk-low ring-risk-low/20',
  warn: 'bg-risk-mid-soft text-risk-mid ring-risk-mid/20',
  danger: 'bg-risk-high-soft text-risk-high ring-risk-high/20',
}

type StatusBannerProps = {
  tone: Tone
  title: string
  children?: ReactNode
  actionLabel?: string
  onAction?: () => void
}

/** Inline status / error card. */
export function StatusBanner({
  tone,
  title,
  children,
  actionLabel,
  onAction,
}: StatusBannerProps) {
  return (
    <div
      role="status"
      className={`rounded-2xl px-5 py-4 shadow-card ring-1 ${toneClasses[tone]}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight">{title}</p>
          {children ? (
            <div className="text-sm opacity-90">{children}</div>
          ) : null}
        </div>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="shrink-0 rounded-lg border border-current/30 bg-surface-raised/70 px-2.5 py-1 font-mono text-caption tracking-wide uppercase"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

type ApiErrorDetailsProps = {
  error: ApiClientError
}

/** Clinical-facing error summary (code + message). Raw details only in DEV. */
export function ApiErrorDetails({ error }: ApiErrorDetailsProps) {
  return (
    <div className="space-y-1 font-mono text-xs">
      <p>{error.message}</p>
      <p className="opacity-80">
        código: {error.code}
        {error.status != null ? ` · HTTP ${error.status}` : null}
      </p>
      {import.meta.env.DEV && Object.keys(error.details).length > 0 ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-ink-faint">
            detalle técnico
          </summary>
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-xl border border-current/15 bg-surface-raised/80 p-2 text-caption text-ink">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        </details>
      ) : null}
    </div>
  )
}
