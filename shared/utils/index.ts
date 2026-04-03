import type { UnionResponse } from '~~/shared/types'
import { ResponseCode } from '~~/shared/types'
import { UserRole } from '~~/shared/types/db/user'

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

export function greetingMessage() {
  const hour = new Date().getHours()

  if (hour < 6) {
    return '凌晨好'
  } else if (hour < 12) {
    return '上午好'
  } else if (hour < 13) {
    return '中午好'
  } else if (hour < 18) {
    return '下午好'
  } else {
    return '晚上好'
  }
}

/** ISO 时间格式化为「YYYY年MM月DD日 HH:mm:ss」（本地时区） */
export function formatDateTimeZh(iso: string | null | undefined): string {
  if (iso == null || iso === '') return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${y}年${m}月${day}日 ${h}:${min}:${s}`
}

/** 角色中文名与展示用 class（与数据库大小写无关；class 使用标准 utility 便于 Tailwind 生成） */
export function getUserRolePresentation(role: string): { label: string; className: string } {
  const r = String(role ?? '')
    .trim()
    .toLowerCase()
  switch (r) {
    case UserRole.User:
      return { label: '普通用户', className: 'text-highlighted' }
    case UserRole.Vip:
      return {
        label: '超级贵族',
        className: 'font-medium text-amber-500 dark:text-amber-400',
      }
    case UserRole.Admin:
      return { label: '管理员', className: 'font-medium text-blue-600 dark:text-blue-400' }
    default:
      return { label: role || r, className: 'text-highlighted' }
  }
}
