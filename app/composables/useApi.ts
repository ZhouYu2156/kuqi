import type { UnionResponse } from '~~/shared/types/common'

/**
 * 同域请求封装：自动携带 Cookie（HttpOnly JWT），便于与鉴权接口配合。
 * 业务接口应返回 UnionResponse<T>。
 */
export function useApi() {
  async function api<T>(url: string, opts?: Parameters<typeof $fetch>[1]) {
    return $fetch<UnionResponse<T>>(url, {
      ...opts,
      credentials: 'include',
    })
  }

  return { api }
}
