import axios, { type AxiosInstance } from 'axios'

import { env } from '../config/env'

function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 30_000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use((config) => {
    if (import.meta.env.DEV) {
      console.debug(
        '[api] →',
        config.method?.toUpperCase(),
        `${config.baseURL ?? ''}${config.url ?? ''}`,
      )
    }
    return config
  })

  client.interceptors.response.use(
    (response) => {
      if (import.meta.env.DEV) {
        console.debug(
          '[api] ←',
          response.status,
          response.config.method?.toUpperCase(),
          response.config.url,
        )
      }
      return response
    },
    (error: unknown) => {
      if (import.meta.env.DEV && axios.isAxiosError(error)) {
        console.error(
          '[api] ✕',
          error.response?.status,
          error.config?.url,
          error.response?.data ?? error.message,
        )
      }
      return Promise.reject(error)
    },
  )

  return client
}

/** Shared Axios singleton — import this; do not create other clients. */
export const httpClient = createHttpClient()
