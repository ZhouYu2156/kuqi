import type { UnionResponse } from '~~/shared/types'
import { ResponseCode } from '~~/shared/types'

/**
 * 生成随机交易单号
 * @returns 交易单号
 */
export function generateTradeNo() {
  return (
    Date.now().toString() +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(4, '0')
  )
}

/** 对 url 进行编码 */
export function encodeUrl(urlStr: string) {
  //   limit=5
  // offset=10
  // authorized_data={"business_type":"FAVOR_STOCK","stock_id":"2433405"}
  // partner={"type":"APPID","appid":"wx4e1916a585d1f4e9","merchant_id":"2480029552"}

  // （1）先对 authorized_data 参数和 partner 参数做个 URL encode
  const url = new URL(urlStr)
  // 得到解码的查询参数
  const params = url.searchParams
  const paramsArray = Array.from(params.entries())
  const encodedParams = paramsArray.map(([key, value]) => {
    return `${key}=${encodeURIComponent(value)}`
  })
  const encodedParamsStr = encodedParams.join('&')
  // （2）拼接你的请求URL,查询参数需要在末尾加'?'和对应的查询字符串，多个字符串之间用&符号链接，不要加域名
  return `${url.pathname}?${encodedParamsStr}`
}

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
