import { getRequestHeader, getRequestURL } from 'h3'
import { logRequestLine } from '../utils/logger'

/**
 * Nitro 服务端中间件：在 server/middleware/ 下按文件名排序执行。
 * 本文件使用 01- 前缀，确保先于 02-auth.ts 执行，便于鉴权阶段已存在 requestId。
 *
 * 本中间件做两件事：
 * 1. 生成 requestId 写入 event.context，后续在 API 里可用 event.context.requestId 打同一串 ID。
 * 2. 在响应结束时打一条访问日志：方法、路径、状态码、耗时。
 *
 * 注意：静态资源、部分内部请求也会经过这里；若噪音大，可在下面加过滤条件后 return。
 */
export default defineEventHandler((event) => {
  const start = performance.now()
  const url = getRequestURL(event)

  const requestId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

  event.context.requestId = requestId

  // 跳过不需要记访问日志的路径
  const p = url.pathname
  if (
    p.startsWith('/_nuxt/') ||
    p.startsWith('/__nuxt') ||
    p === '/favicon.svg' ||
    p.startsWith('/assets') ||
    p.startsWith('/api/_nuxt_icon/')
  )
    return

  const method = event.method || 'GET'
  const path = `${url.pathname}${url.search || ''}`
  const ua = getRequestHeader(event, 'user-agent') || undefined

  event.node.res.on('finish', () => {
    const durationMs = Math.round(performance.now() - start)
    const statusCode = event.node.res.statusCode || 0
    logRequestLine({
      requestId,
      method,
      path,
      statusCode,
      durationMs,
      userAgent: ua,
    })
  })
})
