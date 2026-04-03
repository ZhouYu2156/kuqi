import bcrypt from 'bcryptjs'
import { getRequestIP, readBody } from 'h3'
import type { AuthLoginBody, AuthTokenData } from '~~/shared/types/api/auth'
import { ResponseCode } from '~~/shared/types'
import { UserStatus } from '~~/shared/types/db/user'
import { UnionResponseResult } from '~~/shared/utils'
import { signAccessToken } from '~~/server/utils/jwt'
import { buildAuthUserPayload, fetchUserById, findUserByEmail, updateLastLogin } from '~~/server/utils/userRepo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<AuthLoginBody>(event)
  const email = (body.email ?? '').trim().toLowerCase()
  const password = body.password ?? ''

  if (!email || !password) {
    return UnionResponseResult(null as unknown as AuthTokenData, '请输入邮箱和密码', ResponseCode.BadRequest)
  }
  if (!EMAIL_RE.test(email)) {
    return UnionResponseResult(null as unknown as AuthTokenData, '邮箱格式不正确', ResponseCode.BadRequest)
  }

  const row = await findUserByEmail(email)
  if (!row?.password_hash) {
    return UnionResponseResult(null as unknown as AuthTokenData, '邮箱或密码错误', ResponseCode.BadRequest)
  }

  const ok = await bcrypt.compare(password, row.password_hash)
  if (!ok) {
    return UnionResponseResult(null as unknown as AuthTokenData, '邮箱或密码错误', ResponseCode.BadRequest)
  }

  if (row.status !== UserStatus.Active) {
    return UnionResponseResult(null as unknown as AuthTokenData, '账号不可用', ResponseCode.Forbidden)
  }

  const userId = Number(row.id)
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? null
  await updateLastLogin(userId, ip)

  const fresh = await fetchUserById(userId)
  if (!fresh) {
    return UnionResponseResult(null as unknown as AuthTokenData, '登录失败', ResponseCode.ServerError)
  }

  const user = await buildAuthUserPayload(fresh)
  const token = await signAccessToken({
    username: user.username,
    email: user.email,
  })

  return UnionResponseResult<AuthTokenData>({ token, user }, '登录成功')
})
