import { createError } from 'h3'
import type { MusicDetailItem } from '~~/shared/types/api/music'
import { ResponseCode } from '~~/shared/types'
import { UserRole } from '~~/shared/types/db/user'
import { UnionResponseResult } from '~~/shared/utils'
import { getTreasuredById, readUtf8IfExists } from '~~/server/utils/treasuredMusic'
import { findUserByEmail } from '~~/server/utils/userRepo'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')?.trim() ?? ''
  const row = getTreasuredById(id)
  if (!row) {
    return UnionResponseResult(null as unknown as MusicDetailItem, '曲目不存在', ResponseCode.NotFound)
  }

  const jwt = event.context.auth?.jwt
  if (!jwt?.email) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { code: ResponseCode.Unauthorized, message: '请先登录', data: null },
    })
  }

  const user = await findUserByEmail(jwt.email)
  if (!user) {
    return UnionResponseResult(null as unknown as MusicDetailItem, '用户不存在', ResponseCode.NotFound)
  }
  if (String(user.role).toLowerCase() !== UserRole.Vip) {
    return UnionResponseResult(
      null as unknown as MusicDetailItem,
      '珍藏曲目仅会员可播放，请先开通会员',
      ResponseCode.Forbidden,
    )
  }

  const lyrics = row.lrc ? await readUtf8IfExists(row.lrc) : ''
  const encodeId = `treasured:${row.id}`
  const img = row.cover || '/favicon.svg'

  const detail: MusicDetailItem = {
    hash: row.id,
    timelength: 0,
    author_name: row.author_name,
    song_name: row.song_name,
    album_name: '珍藏音乐',
    audio_name: `${row.author_name} - ${row.song_name}`,
    img,
    lyrics,
    play_url: row.audio,
    play_backup_url: '',
    encode_album_audio_id: encodeId,
  }

  return UnionResponseResult<MusicDetailItem>(detail, '即将播放…')
})
