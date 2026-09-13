import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { fetchHealth } from '../api/health'
import { toApiClientError } from '../api/errors'
import type { BackendStatusState } from '../api/types'

export type { BackendStatusState }

/**
 * Loads `/health` and exposes refresh. Keep this out of presentational components.
 * API layer maps failures to {@link ApiClientError}; hook remaps only as a safety net.
 */
export function useBackendStatus(): BackendStatusState & {
  refresh: () => void
} {
  const [state, setState] = useState<BackendStatusState>({ kind: 'loading' })
  const [requestId, setRequestId] = useState(0)

  const refresh = useCallback(() => {
    setState({ kind: 'loading' })
    setRequestId((id) => id + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    void fetchHealth({ signal: controller.signal })
      .then((health) => {
        setState({ kind: 'ready', health })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || axios.isCancel(error)) return
        setState({ kind: 'error', error: toApiClientError(error) })
      })

    return () => {
      controller.abort()
    }
  }, [requestId])

  return { ...state, refresh }
}
