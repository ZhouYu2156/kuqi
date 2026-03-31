import { UnionResponseResult } from '~/utils'
import { MusicItem } from '~~/shared/types'
import { getSingleSongSignature, headers, token } from './index.get'

/**
 * 获取单首音乐详细信息
 * @param {string} audioId music Unique ID
 * @return music detail
 */
export async function getSingleMusic(audioId: string) {
  // 1. 构造请求参数
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
  console.log(JSON.stringify(payload, null, 2))

  type MusicDetailResponse = {
    status: number
    err_code: number
    data: MusicItem
  }
  // 2. 发起请求
  const response = (await $fetch(targetUrl, {
    method: 'GET',
    headers,
    params: payload,
  })) as MusicDetailResponse
  // 3. 处理响应数据

  return response.data
}

// 请求处理函数
export default defineEventHandler(async (event) => {
  const { audioId = null } = getQuery<{ audioId: string }>(event)

  console.log('audio: ', audioId)
  if (!audioId) {
    return {
      status: 400,
      body: '参数错误',
    }
  }

  const resposne = await getSingleMusic(audioId)

  return UnionResponseResult(resposne, '获取成功', 200)
})
