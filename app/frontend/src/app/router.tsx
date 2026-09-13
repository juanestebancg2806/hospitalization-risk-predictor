import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '../components/layout/AppShell'
import { HomePage } from '../pages/HomePage'
import { PredictPage } from '../pages/PredictPage'
import { NotFoundPage, RouteErrorPage } from '../pages/RouteErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: (
      <AppShell>
        {/* errorElement replaces the matched route tree; reuse shell chrome */}
        <RouteErrorPage />
      </AppShell>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'predict',
        element: <PredictPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
