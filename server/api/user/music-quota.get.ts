import { defineEventHandler } from 'h3'
import { ok, fail } from '~~/server/utils/apiResponse'
import { getAuthUser } from '~~/server/utils/authContext'
import { DAILY_FREE_LIMIT, getTodayPlayCount, hasUnlimitedMusic } from '~~/server/lib/musicQuota'
import { ResponseCode } from '~~/shared/types/common'
import type { MusicQuotaData } from '~~/shared/types/auth'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) {
    return fail(event, ResponseCode.Unauthorized, '未登录', null)
  }

  const unlimited = hasUnlimitedMusic(user)
  let remainingFree: number | null = null
  if (!unlimited) {
    const used = await getTodayPlayCount(user.id)
    if (used < 0) {
      return fail(event, ResponseCode.ServerError, '额度读取失败', null)
    }
    remainingFree = Math.max(0, DAILY_FREE_LIMIT - used)
  }

  const data: MusicQuotaData = {
    remainingFree,
    dailyFreeLimit: DAILY_FREE_LIMIT,
    unlimited,
    canPlay: true,
  }
  return ok(event, data, 'ok')
})
