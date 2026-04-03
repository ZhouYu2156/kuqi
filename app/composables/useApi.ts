import type { FetchOptions } from 'ofetch'
import { FetchError } from 'ofetch'
import type { UnionResponse } from '~~/shared/types'
import { ResponseCode } from '~~/shared/types'

export type ApiOptions = FetchOptions & {
  /** 为 true 时不自动弹出错误提示 */
  silent?: boolean
}

function isUnionBody(x: unknown): x is UnionResponse<unknown> {
  return typeof x === 'object' && x !== null && 'code' in x && 'message' in x
}

function errorMessage(e: unknown): string {
  if (e instanceof FetchError) {
    const raw = e.data ?? e.response?._data
    if (isUnionBody(raw)) return raw.message
    if (raw && typeof raw === 'object' && 'message' in raw) {
      return String((raw as { message: unknown }).message)
    }
    return e.statusMessage ?? e.message ?? '请求失败'
  }
  return e instanceof Error ? e.message : '请求失败'
}

/**
 * 业务请求：自动带 token、用户信息；业务 code 非成功或 HTTP 错误时统一 Toast。
 */
export function useApi() {
  const toast = useToast()
  const auth = useAuthUser()
  const config = useRuntimeConfig()

  const request = $fetch.create({
    baseURL: (config.public.apiBase as string) || '',
    credentials: 'include',
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
    onRequest({ options }) {
      const h = new Headers(options.headers as HeadersInit)
      const { token, user } = auth.value ?? {}

      if (token) {
        h.set('Authorization', `Bearer ${token}`)
      }
      if (user) {
        h.set('X-User-Info', encodeURIComponent(JSON.stringify(user)))
      }

      options.headers = h
    },
  })

  async function api<T>(url: string, opts?: ApiOptions): Promise<UnionResponse<T>> {
    const { silent, ...fetchOpts } = opts ?? {}

    try {
      const data = await request<UnionResponse<T>>(url, fetchOpts as Parameters<typeof request>[1])

      if (data.code !== ResponseCode.Success && !silent) {
        toast.add({ title: data.message, color: 'error', icon: 'i-lucide-circle-alert' })
      }
      return data
    } catch (e) {
      if (!silent) {
        toast.add({ title: errorMessage(e), color: 'error', icon: 'i-lucide-wifi-off' })
      }
      throw e
    }
  }

  return { request, api }
}
