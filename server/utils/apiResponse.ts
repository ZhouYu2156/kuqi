import { createError, getHeader, type H3Event } from 'h3'
import { ResponseCode, type UnionResponse } from '~~/shared/types/common'

function rid(event: H3Event) {
  return getHeader(event, 'x-request-id') || crypto.randomUUID()
}

export function ok<T>(event: H3Event, data: T, message = 'ok'): UnionResponse<T> {
  return {
    code: ResponseCode.Success,
    message,
    data,
    requestId: rid(event),
  }
}

export function fail<T = never>(
  event: H3Event,
  code: ResponseCode,
  message: string,
  data = null as T,
): UnionResponse<T | null> {
  return {
    code,
    message,
    data,
    requestId: rid(event),
  }
}

/** 抛出带统一响应体的 HTTP 错误（由 Nitro error handler 或调用方 catch） */
export function sendFail(
  event: H3Event,
  code: ResponseCode,
  message: string,
  httpStatus?: number,
) {
  const body = fail(event, code, message)
  throw createError({
    statusCode: httpStatus ?? (code === ResponseCode.Unauthorized ? 401 : code === ResponseCode.Forbidden ? 403 : 400),
    statusMessage: message,
    data: body,
  })
}
