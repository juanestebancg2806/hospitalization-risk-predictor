import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { TextLink } from '../components/ui/TextLink'

/** Router-level fallback for unexpected render/data errors. */
export function RouteErrorPage() {
  const error = useRouteError()

  let title = 'Algo salió mal'
  let detail = 'Ocurrió un error inesperado al cargar esta vista.'

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Página no encontrada' : `Error ${error.status}`
    detail =
      typeof error.data === 'string'
        ? error.data
        : error.statusText || detail
  } else if (error instanceof Error) {
    detail = error.message
  }

  return (
    <div className="space-y-4">
      <p className="font-mono text-caption tracking-wide text-risk-high uppercase">
        Error de navegación
      </p>
      <h1>{title}</h1>
      <p className="max-w-xl text-ink-muted">{detail}</p>
      <TextLink to="/">← Volver al inicio</TextLink>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <p className="font-mono text-caption tracking-wide text-ink-faint uppercase">
        404
      </p>
      <h1>Página no encontrada</h1>
      <p className="max-w-xl text-ink-muted">
        La ruta no existe en esta aplicación.
      </p>
      <TextLink to="/">← Volver al inicio</TextLink>
    </div>
  )
}
