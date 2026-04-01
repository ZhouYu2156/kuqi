import { defineEventHandler, getQuery } from 'h3'
import { UnionResponseResult } from '~/utils'
import { getSingleMusic } from '~~/server/api/music/kugouSingle'
import { getAuthUser } from '~~/server/utils/authContext'
import { canConsumeMusicPlay, DAILY_FREE_LIMIT, hasUnlimitedMusic, incrementTodayPlay } from '~~/server/lib/musicQuota'
import { fail } from '~~/server/utils/apiResponse'
import { ResponseCode } from '~~/shared/types/common'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) {
    return fail(event, ResponseCode.Unauthorized, '请先登录后再试听（免费用户每日可试听歌曲）', null)
  }

  const { audioId = null } = getQuery<{ audioId: string }>(event)
  if (!audioId) {
    return fail(event, ResponseCode.BadRequest, '缺少 audioId', null)
  }

  if (!hasUnlimitedMusic(user)) {
    const gate = await canConsumeMusicPlay(user)
    if (!gate.ok) {
      if (gate.reason === 'QUOTA_DB') {
        return fail(event, ResponseCode.ServerError, '额度统计暂不可用，请稍后再试', null)
      }
      return fail(event, ResponseCode.Forbidden, `今日免费试听额度已用完（每日 ${DAILY_FREE_LIMIT} 首），开通会员后可畅听与下载`, {
        reason: 'MUSIC_QUOTA',
        upgradePath: '/membership',
        dailyFreeLimit: DAILY_FREE_LIMIT,
      })
    }
  }

  try {
    const data = await getSingleMusic(audioId)
    if (!hasUnlimitedMusic(user)) {
      await incrementTodayPlay(user.id)
    }
    return UnionResponseResult(data, '获取成功', ResponseCode.Success)
  }
  catch (e) {
    console.error('[music/play]', e)
    return fail(event, ResponseCode.ServerError, '获取播放信息失败', null)
  }
})
