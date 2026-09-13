import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

import { env } from '../config/env'

/**
 * Singleton Axios client for the backend API.
 * Use {@link httpClient} — do not call `axios.create` elsewhere.
 */
class HttpClient {
  private static instance: AxiosInstance | null = null

  private constructor() {}

  static getInstance(): AxiosInstance {
    if (HttpClient.instance === null) {
      HttpClient.instance = axios.create({
        baseURL: env.apiBaseUrl,
        timeout: 30_000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      HttpClient.registerInterceptors(HttpClient.instance)
    }
    return HttpClient.instance
  }

  private static registerInterceptors(client: AxiosInstance): void {
    client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Hook for auth headers, correlation IDs, etc.
        if (import.meta.env.DEV) {
          console.debug(
            '[api] →',
            config.method?.toUpperCase(),
            config.baseURL
              ? `${config.baseURL}${config.url ?? ''}`
              : config.url,
          )
        }
        return config
      },
      (error: unknown) => Promise.reject(error),
    )

    client.interceptors.response.use(
      (response: AxiosResponse) => {
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
        if (axios.isAxiosError(error)) {
          const status = error.response?.status
          const url = error.config?.url
          const detail =
            error.response?.data ?? error.message ?? 'Unknown API error'

          if (import.meta.env.DEV) {
            console.error('[api] ✕', status, url, detail)
          }

          return Promise.reject(error)
        }

        return Promise.reject(error)
      },
    )
  }
}

/** Shared Axios singleton — import this in API modules / hooks. */
export const httpClient = HttpClient.getInstance()
