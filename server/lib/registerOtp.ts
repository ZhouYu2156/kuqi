/** 注册邮箱验证码（内存存储；多实例部署需 Redis） */
type Entry = { code: string; exp: number }

const store = new Map<string, Entry>()
const TTL_MS = 10 * 60 * 1000

function key(email: string) {
  return email.trim().toLowerCase()
}

export function saveRegisterOtp(email: string, code: string): void {
  const k = key(email)
  store.set(k, { code, exp: Date.now() + TTL_MS })
}

export function verifyAndConsumeRegisterOtp(email: string, code: string): boolean {
  const k = key(email)
  const row = store.get(k)
  if (!row) return false
  if (Date.now() > row.exp) {
    store.delete(k)
    return false
  }
  if (row.code !== code.trim()) return false
  store.delete(k)
  return true
}

/** 发送间隔（秒） */
const lastSent = new Map<string, number>()
const SEND_GAP_MS = 60 * 1000

export function canSendAgain(email: string): { ok: boolean; waitSec?: number } {
  const k = key(email)
  const prev = lastSent.get(k) ?? 0
  const elapsed = Date.now() - prev
  if (elapsed < SEND_GAP_MS) {
    return { ok: false, waitSec: Math.ceil((SEND_GAP_MS - elapsed) / 1000) }
  }
  return { ok: true }
}

export function markSent(email: string): void {
  lastSent.set(key(email), Date.now())
}
