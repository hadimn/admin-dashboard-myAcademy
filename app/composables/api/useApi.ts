// composables/api/useApi.ts
import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export const useApi = <T>(
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