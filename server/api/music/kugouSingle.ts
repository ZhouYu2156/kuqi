import { getSingleSongSignature, headers, token } from './index.get'
import type { MusicItem } from '~~/shared/types'

/**
 * 获取单首音乐详细信息（播放地址等）
 */
export async function getSingleMusic(audioId: string) {
  const targetUrl = 'https://wwwapi.kugou.com/play/songinfo'
  const timestamp = Date.now()
  const signatrue = getSingleSongSignature(timestamp, audioId)
  const payload = {
    srcappid: '2919',
    clientver: '20000',
    clienttime: timestamp,
    mid: '26983d9533541a7156f708491cfeceab',
    uuid: '26983d9533541a7156f708491cfeceab',
    dfid: '4FGxv900QtNq2M7rJX0MjIZI',
    appid: '1014',
    platid: '4',
    encode_album_audio_id: audioId,
    token: token,
    userid: '2175914904',
    signature: signatrue,
  }

  type MusicDetailResponse = {
    status: number
    err_code: number
    data: MusicItem
  }

  const response = (await $fetch(targetUrl, {
    method: 'GET',
    headers,
    params: payload,
  })) as MusicDetailResponse

  return response.data
}
