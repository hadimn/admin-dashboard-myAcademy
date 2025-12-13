// composables/api/useApi.ts
import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

// 1) SSR-aware composable (useFetch) – use only in setup/middleware/plugins
export const ApiUseFetch = <T>(
  method: HttpMethod,
  url: string,
  body: Record<string, any> = {},
  options: UseFetchOptions<T> = {}
) => {
  const config = useRuntimeConfig()

  const defaults: UseFetchOptions<T> = {
    method: method as any, // method typing is very strict, cast here
    body: method !== 'get' ? body : undefined,
    headers: {
      Accept: 'application/json',
    },
  }

  // defu loses some generic detail; cast to any before passing to useFetch
  const params = defu(options, defaults) as any

  return useFetch<T>(`${config.public.apiBaseUrl}${url}`, params)
}

// 2) Action/helper for event handlers (uses $fetch)
export const apiFetch = async <T>(
  method: HttpMethod,
  url: string,
  body: Record<string, any> = {},
  options: any = {}
): Promise<T> => {
  const config = useRuntimeConfig()

  const defaults = {
    method,
    body: method !== 'get' ? body : undefined,
    headers: {
      Accept: 'application/json',
    },
  }

  const params = defu(options, defaults) as any

  return $fetch<T>(`${config.public.apiBaseUrl}${url}`, params)
}