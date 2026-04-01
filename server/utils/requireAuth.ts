import type { H3Event } from 'h3'
import { sendFail } from '~~/server/utils/apiResponse'
import { getAuthUser } from '~~/server/utils/authContext'
import type { AuthUser, UserRole } from '~~/shared/types/auth'
import { ResponseCode } from '~~/shared/types/common'

export async function requireAuth(event: H3Event): Promise<AuthUser> {
  const user = await getAuthUser(event)
  if (!user) {
    sendFail(event, ResponseCode.Unauthorized, '请先登录', 401)
  }
  return user as AuthUser
}

export async function requireRole(event: H3Event, roles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth(event)
  if (!roles.includes(user.role)) {
    sendFail(event, ResponseCode.Forbidden, '无权访问该资源', 403)
  }
  return user
}
