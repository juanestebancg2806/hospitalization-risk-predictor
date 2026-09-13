import type { ReactNode } from 'react'

import type { ApiClientError } from '../../api/errors'

type Tone = 'neutral' | 'ok' | 'warn' | 'danger'

const toneClasses: Record<Tone, string> = {
  neutral: 'border-line bg-surface text-ink-muted',
  ok: 'border-risk-low/40 bg-risk-low-soft text-risk-low',
  warn: 'border-risk-mid/40 bg-risk-mid-soft text-risk-mid',
  danger: 'border-risk-high/40 bg-risk-high-soft text-risk-high',
}

type StatusBannerProps = {
  tone: Tone
  title: string
  children?: ReactNode
  actionLabel?: string
  onAction?: () => void
}

/** Inline status / error strip — no floating toast cards. */
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
      className={`border-l-4 border-y border-r px-4 py-3 ${toneClasses[tone]}`}
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
            className="shrink-0 border border-current px-2 py-1 font-mono text-[11px] tracking-wide uppercase"
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
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap border border-current/20 bg-surface-raised/50 p-2 text-[11px] text-ink">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        </details>
      ) : null}
    </div>
  )
}
