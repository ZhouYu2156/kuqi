import { createError, getRequestHeader, getRequestURL, type H3Event } from 'h3'
import { ResponseCode } from '~~/shared/types'
import { verifyAccessToken } from '~~/server/utils/jwt'

/** 完全匹配：无需登录的接口（如注册、登录） */
const PUBLIC_API_PATHS = new Set(['/api/auth/register', '/api/auth/login', '/api/auth/send-email-code'])

/** 酷狗搜索与详情为公开；珍藏音乐列表公开，单首播放需登录+会员（见 treasured/[id] 内校验） */
function isPublicMusicPath(pathname: string): boolean {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p === '/api/music') return true
  if (p === '/api/music/detail') return true
  if (p === '/api/music/treasured') return true
  return false
}

function isPublicApiPath(pathname: string): boolean {
  if (PUBLIC_API_PATHS.has(pathname)) return true
  if (isPublicMusicPath(pathname)) return true
  if (pathname.startsWith('/api/_nuxt_icon')) return true
  /** 微信支付异步通知（无用户 Cookie，由微信服务器 POST） */
  if (pathname === '/api/order/wx-notify') return true
  return false
}

function parseBearerToken(event: H3Event): string | null {
  const raw = getRequestHeader(event, 'authorization')
  if (!raw?.toLowerCase().startsWith('bearer ')) return null
  const t = raw.slice(7).trim()
  return t || null
}

function parseUserInfoHeader(event: H3Event): unknown | null {
  const raw = getRequestHeader(event, 'x-user-info')
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(raw)) as unknown
  } catch {
    return null
  }
}

/**
 * 认证：公开路由仅解析 token；受保护路由必须携带有效 JWT。
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api')) return

  const token = parseBearerToken(event)
  const userHeader = parseUserInfoHeader(event)

  event.context.auth = {
    token,
    user: userHeader,
    jwt: null,
  }

  if (isPublicApiPath(path)) {
    if (token) {
      try {
        event.context.auth.jwt = await verifyAccessToken(token)
      } catch {
        /* 公开接口允许无效 token，不拦截 */
      }
    }
    return
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        code: ResponseCode.Unauthorized,
        message: '请先登录',
        data: null,
      },
    })
  }

  try {
    event.context.auth.jwt = await verifyAccessToken(token)
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        code: ResponseCode.Unauthorized,
        message: '令牌无效或已过期',
        data: null,
      },
    })
  }
})
