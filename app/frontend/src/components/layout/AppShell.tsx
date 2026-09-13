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
      <header className="border-b border-brand-strong bg-pine text-surface-raised">
        <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-4 px-6 py-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-brand-soft uppercase">
              Análisis de datos I · MVP
            </p>
            <Link to="/" className="text-lg font-semibold tracking-tight">
              Riesgo de hospitalización
            </Link>
          </div>
          <p className="hidden text-right text-xs text-brand-soft sm:block">
            Diabetes · Hipertensión
            <br />
            horizonte 12 meses
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {children ?? <Outlet />}
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-6 font-mono text-[11px] text-ink-faint">
          Modelo v1 · pipeline sklearn · datos sintéticos ofuscados (Colombia)
        </div>
      </footer>
    </div>
  )
}
