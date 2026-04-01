import type { AuthUser } from '~~/shared/types/auth'
import db from '~~/server/lib/db'

/** 非会员每日免费试听首数 */
export const DAILY_FREE_LIMIT = 10

/**
 * 会员/管理端：不限次；有效合约期内不限次
 */
export function hasUnlimitedMusic(user: AuthUser): boolean {
  if (user.role === 'admin' || user.role === 'vip') return true
  if (!user.membershipUntil) return false
  const until = new Date(user.membershipUntil)
  if (Number.isNaN(until.getTime())) return false
  return until > new Date()
}

export async function getTodayPlayCount(userId: string): Promise<number> {
  try {
    const [rows] = await db.query(
      'SELECT play_count FROM user_music_daily WHERE user_id = ? AND play_date = CURDATE() LIMIT 1',
      [userId],
    )
    const list = rows as { play_count: number }[]
    return list[0]?.play_count ?? 0
  }
  catch {
    return -1
  }
}

export async function incrementTodayPlay(userId: string): Promise<void> {
  await db.query(
    `INSERT INTO user_music_daily (user_id, play_date, play_count)
     VALUES (?, CURDATE(), 1)
     ON DUPLICATE KEY UPDATE play_count = play_count + 1`,
    [userId],
  )
}

export async function canConsumeMusicPlay(user: AuthUser): Promise<{ ok: boolean; reason?: string }> {
  if (hasUnlimitedMusic(user)) return { ok: true }
  const n = await getTodayPlayCount(user.id)
  if (n < 0) {
    return { ok: false, reason: 'QUOTA_DB' }
  }
  if (n >= DAILY_FREE_LIMIT) {
    return { ok: false, reason: 'QUOTA_EXCEEDED' }
  }
  return { ok: true }
}
