/**
 * Typed access to Vite env vars.
 * Only variables prefixed with VITE_ are exposed to the client.
 */
function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL').replace(/\/$/, ''),
} as const
