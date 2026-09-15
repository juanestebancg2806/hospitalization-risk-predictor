import type { ReactNode } from 'react'
import { Link, Outlet } from 'react-router-dom'

type AppShellProps = {
  /** When set (e.g. router errorElement), render children instead of {@link Outlet}. */
  children?: ReactNode
}

/** Shared layout — child routes render in Outlet unless `children` is provided. */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-10 border-b border-line/80 bg-surface-raised/85 backdrop-blur-md">
        <div className="h-1 bg-brand" aria-hidden="true" />
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <div className="min-w-0">
            <p className="font-mono text-caption tracking-[0.16em] text-brand uppercase">
              Evaluación clínica
            </p>
            <Link
              to="/"
              className="font-display text-lg font-semibold tracking-tight text-ink"
            >
              Riesgo de hospitalización
            </Link>
          </div>
          <p className="hidden text-right text-xs text-ink-muted sm:block">
            Diabetes · Hipertensión
            <br />
            horizonte 12 meses
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">{children ?? <Outlet />}</div>

      <footer className="border-t border-line/80">
        <div className="mx-auto max-w-4xl px-6 py-6 font-mono text-caption text-ink-faint">
          Riesgo de hospitalización a 12 meses · diabetes e hipertensión
        </div>
      </footer>
    </div>
  )
}
