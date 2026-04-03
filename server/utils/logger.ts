import fs from 'fs'
import path from 'path'

/**
 * 服务端轻量日志：中间件、API 路由里都可 import 使用。
 * 后续可换成 pino / winston 等，只改本文件实现即可。
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

function minLevel(): LogLevel {
  const v = (process.env.LOG_LEVEL || 'info').toLowerCase() as LogLevel
  return LEVEL_ORDER[v] ? v : 'info'
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[minLevel()]
}

function ts(): string {
  return new Date().toISOString()
}

export function log(level: LogLevel, message: string, extra?: Record<string, unknown>): void {
  if (!shouldLog(level)) return
  const line = `[${ts()}] [http] [${level.toUpperCase()}] ${message}`
  if (extra && Object.keys(extra).length > 0) {
    if (level === 'error') console.error(line, extra)
    else if (level === 'warn') console.warn(line, extra)
    else console.log(line, extra)
  } else {
    if (level === 'error') console.error(line)
    else if (level === 'warn') console.warn(line)
    else console.log(line)
  }
}

/** 请求维度的访问日志（由中间件调用） */
export function logRequestLine(parts: {
  requestId: string
  method: string
  path: string
  statusCode: number
  durationMs: number
  userAgent?: string
}): void {
  if (!shouldLog('info')) return
  const ua = parts.userAgent ? ` ua=${parts.userAgent.slice(0, 80)}` : ''
  // 写入日志文件
  const logFilePath = path.join(process.cwd(), 'logs', 'request.log')
  fs.appendFileSync(
    logFilePath,
    `${ts()} [http] [ACCESS] ${parts.requestId} ${parts.method} ${parts.path} ${parts.statusCode} ${parts.durationMs}ms${ua}\n`,
  )
}
