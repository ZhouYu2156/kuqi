/**
 * 为 Nitro / h3 的 event.context 补充字段，便于在中间件与 API 之间传递 requestId 等。
 */
declare module 'h3' {
  interface H3EventContext {
    /** 由 server/middleware/01-log.ts 注入，便于串联一次请求的多条日志 */
    requestId?: string
    /** 由 server/middleware/02-auth.ts 注入：Bearer、X-User-Info、校验通过后的 JWT 声明 */
    auth?: {
      token: string | null
      user: unknown | null
      jwt?: {
        username: string
        email: string
      } | null
    }
  }
}

export {}
