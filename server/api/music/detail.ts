export default defineEventHandler(async (event) => {
  // 1. 读取请求参数
  const query = getQuery<{ audioId: string }>(event)

  // 2. 调用酷狗 API 获取音乐详情
  const response = await getMusicDetail(query.audioId)

  // 3. 返回结果
  return UnionResponseResult(response, '即将播放...')
})
