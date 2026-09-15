import { BackendStatusPanel, HomeIntro } from '../components/home/HomePanels'
import { useBackendStatus } from '../hooks/useBackendStatus'

/**
 * Home: explains the tool, checks service availability, and gates the predict flow.
 * Business logic lives in {@link useBackendStatus}; this page only composes UI.
 */
export function HomePage() {
  const status = useBackendStatus()
  const canPredict =
    status.kind === 'ready' && status.health.model_loaded

  return (
    <div className="space-y-10">
      <HomeIntro canPredict={canPredict} />
      <BackendStatusPanel status={status} onRetry={status.refresh} />
    </div>
  )
}
