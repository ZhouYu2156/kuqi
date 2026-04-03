import { ResponseCode } from '~~/shared/types'
import type { AuthUserPayload } from '~~/shared/types/api/auth'
import { UnionResponseResult } from '~~/shared/utils'
import { buildAuthUserPayload, findUserByEmail } from '~~/server/utils/userRepo'

export default defineEventHandler(async (event) => {
  const jwt = event.context.auth?.jwt
  if (!jwt?.email) {
    return UnionResponseResult(null as unknown as AuthUserPayload, '请先登录', ResponseCode.Unauthorized)
  }

  const row = await findUserByEmail(jwt.email)
  if (!row) {
    return UnionResponseResult(null as unknown as AuthUserPayload, '用户不存在', ResponseCode.NotFound)
  }

  return UnionResponseResult<AuthUserPayload>(await buildAuthUserPayload(row), 'ok')
})
