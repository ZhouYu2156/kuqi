import { createHash, randomInt } from 'node:crypto'
import type { RowDataPacket } from 'mysql2/promise'
import { useRuntimeConfig } from '#imports'
import db from '~~/server/db/index'

/** 验证码有效期（毫秒），30 分钟 */
export const EMAIL_OTP_TTL_MS = 30 * 60 * 1000

function pepper(): string {
  const c = useRuntimeConfig()
  return (c.emailOtpSecret as string) || (c.jwtSecret as string) || 'dev-email-otp-secret'
}

/** 与存储的 code_hash 一致即可校验 */
export function hashEmailCode(email: string, code: string): string {
  const e = email.trim().toLowerCase()
  return createHash('sha256').update(`${pepper()}:${e}:${code}`).digest('hex')
}

export function generateEmailCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

/**
 * 写入或覆盖该邮箱的验证码（同一邮箱仅保留一条 → 仅最后一次有效）
 */
export async function saveEmailOtp(email: string, code: string): Promise<void> {
  const e = email.trim().toLowerCase()
  const hash = hashEmailCode(e, code)
  const expiresAt = new Date(Date.now() + EMAIL_OTP_TTL_MS)
  await db.execute(
    `INSERT INTO email_otps (email, code_hash, expires_at, created_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP(3))
     ON DUPLICATE KEY UPDATE
       code_hash = VALUES(code_hash),
       expires_at = VALUES(expires_at),
       created_at = CURRENT_TIMESTAMP(3)`,
    [e, hash, expiresAt],
  )
}

export async function deleteEmailOtp(email: string): Promise<void> {
  const e = email.trim().toLowerCase()
  await db.execute('DELETE FROM email_otps WHERE email = ?', [e])
}

export async function getLastOtpSentAt(email: string): Promise<Date | null> {
  const e = email.trim().toLowerCase()
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT created_at FROM email_otps WHERE email = ? LIMIT 1',
    [e],
  )
  const r = rows[0] as { created_at: Date } | undefined
  const t = r?.created_at
  return t ? new Date(t) : null
}

/** 校验邮箱验证码（注册等场景调用） */
export async function verifyEmailOtp(email: string, code: string): Promise<boolean> {
  const e = email.trim().toLowerCase()
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT code_hash, expires_at FROM email_otps WHERE email = ? LIMIT 1',
    [e],
  )
  const row = rows[0] as { code_hash: string; expires_at: Date } | undefined
  if (!row) return false
  if (new Date(row.expires_at).getTime() < Date.now()) return false
  return hashEmailCode(e, code) === row.code_hash
}
