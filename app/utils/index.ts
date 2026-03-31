import type { UnionResponse } from '~~/shared/types'

export function UnionResponseResult<T extends unknown>(data: T, message: string, code: number): UnionResponse<T> {
  return {
    code,
    message,
    data,
  }
}
