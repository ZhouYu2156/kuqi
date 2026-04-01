import type { UnionResponse } from '~~/shared/types'
import { ResponseCode } from '~~/shared/types'

// 统一响应结果
export function UnionResponseResult<T extends unknown>(
  data: T,
  message: string,
  code: ResponseCode | number = ResponseCode.Success,
): UnionResponse<T> {
  return {
    code: code as ResponseCode,
    message,
    data,
  }
}
