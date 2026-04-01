import { getSearchMusicList } from '~~/server/utils'
import { UnionResponseResult } from '~~/shared/utils'

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
