import { defineEventHandler } from 'h3'
import { ok, fail } from '~~/server/utils/apiResponse'
import { getAuthUser } from '~~/server/utils/authContext'
import { ResponseCode } from '~~/shared/types/common'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) {
    return fail(event, ResponseCode.Unauthorized, '未登录', null)
  }
  return ok(event, { user }, 'ok')
})
