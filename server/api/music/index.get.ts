import crypto from 'node:crypto'
import { UnionResponseResult } from '~/utils'
import type { MusicItem } from '~~/shared/types'

export const token = '6939c94fb3f6a910bece970ccbd5439dc451d1001e349d7ce1ed38cc92465310'
export const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
}

/**
 * 生成搜索歌曲的加密签名
 * @param {number} timestamp - 时间戳（数字类型）
 * @param {string} keyword - 搜索关键字
 * @param {number} page - 搜索结果页码（整数）
 * @param {number} pagesize - 搜索结果页面数据量（整数）
 * @returns {string} 加密后的 MD5 签名（小写）
 */
export function getSearchSignature(timestamp: number, keyword: string, page: number, pagesize: number) {
  // 构造参数数组（保持和 Python 一致的顺序）
  const params = [
    'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt',
    'appid=1014',
    'bitrate=0',
    'callback=callback123',
    `clienttime=${timestamp}`,
    'clientver=1000',
    'dfid=4FGxv900QtNq2M7rJX0MjIZI',
    'filter=10',
    'inputtype=0',
    'iscorrection=1',
    'isfuzzy=0',
    `keyword=${keyword}`,
    'mid=26983d9533541a7156f708491cfeceab',
    `page=${page}`,
    `pagesize=${pagesize}`,
    'platform=WebFilter',
    'privilege_filter=0',
    'srcappid=2919',
    `token=${token}`,
    'userid=2175914904',
    'uuid=26983d9533541a7156f708491cfeceab',
    'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt',
  ]

  // 1. 拼接参数成字符串
  const strToEncrypt = params.join('')
  // 2. 创建 MD5 哈希对象并更新内容（UTF-8 编码）
  const md5 = crypto.createHash('md5')
  md5.update(strToEncrypt, 'utf8')
  // 3. 获取 16 进制小写签名（和 Python hexdigest() 一致）
  const signature = md5.digest('hex')

  return signature
}

/**
 * 生成获取单首音乐的加密签名
 * @param {number} timestamp - 时间戳
 * @param {string|number} audio_id - 音乐ID
 * @returns {string} MD5签名
 */
export function getSingleSongSignature(timestamp: number, audioId: string) {
  const params = [
    'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt',
    'appid=1014',
    `clienttime=${timestamp}`,
    'clientver=20000',
    'dfid=4FGxv900QtNq2M7rJX0MjIZI',
    `encode_album_audio_id=${audioId}`,
    'mid=26983d9533541a7156f708491cfeceab',
    'platid=4',
    'srcappid=2919',
    `token=${token}`,
    'userid=2175914904',
    'uuid=26983d9533541a7156f708491cfeceab',
    'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt',
  ]

  const strToEncrypt = params.join('')
  const md5 = crypto.createHash('md5')
  md5.update(strToEncrypt, 'utf8')
  return md5.digest('hex')
}

export async function getSearchMusicList(kw: string, page: number, pagesize: number) {
  // 构造请求参数
  const targetUrl = 'https://complexsearch.kugou.com/v2/search/song'
  const timestamp = Date.now()
  const signature = getSearchSignature(timestamp, kw, page, pagesize)
  // 请求载荷
  const payload = {
    callback: 'callback123',
    srcappid: '2919',
    clientver: '1000',
    clienttime: timestamp,
    mid: '26983d9533541a7156f708491cfeceab',
    uuid: '26983d9533541a7156f708491cfeceab',
    dfid: '4FGxv900QtNq2M7rJX0MjIZI',
    keyword: kw,
    page: page,
    pagesize: pagesize,
    bitrate: '0',
    isfuzzy: '0',
    inputtype: '0',
    platform: 'WebFilter',
    userid: '2175914904',
    iscorrection: '1',
    privilege_filter: '0',
    filter: '10',
    token: token,
    appid: '1014',
    signature: signature,
  }
  // 发送请求, 响应结果为 callback123({...})
  const response = await $fetch<string>(targetUrl, {
    method: 'GET',
    headers,
    params: payload,
  })

  const extractPattern = /callback123\((.*)\)$/

  const jsonStr = response.trim().match(extractPattern) as [
    string,
    string,
    index: number,
    input: string,
    groups: undefined,
  ]

  interface KugouSearchResponse {
    error_msg: string
    data: {
      page: number
      pagesize: number
      total: number
      lists: MusicItem[]
    }
    status: number
    error_code: number
  }
  const result = JSON.parse(jsonStr[1]) as KugouSearchResponse

  return result.data
}

export default defineEventHandler(async (event) => {
  // 1. 读取请求参数
  const { keyword, page, pagesize } = getQuery<{ keyword: string; page: number; pagesize: number }>(event)

  // 2.验证参数
  if (!keyword || typeof +page !== 'number' || typeof +pagesize !== 'number') {
    return {
      status: 400,
      body: '参数错误',
    }
  }
  // 3. 返回结果
  const response = await getSearchMusicList(keyword, page, pagesize)

  return UnionResponseResult(response, '搜索成功', 200)
})
