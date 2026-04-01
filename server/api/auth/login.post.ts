import bcrypt from 'bcryptjs'
import { defineEventHandler, readBody } from 'h3'
import { findUserByEmail, rowToAuthUser } from '~~/server/lib/userRepo'
import { ok, fail } from '~~/server/utils/apiResponse'
import { setAuthCookie } from '~~/server/utils/authContext'
import { signAccessToken } from '~~/server/utils/jwt'
import { ResponseCode } from '~~/shared/types/common'
import type { LoginBody } from '~~/shared/types/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const email = body?.email?.trim()?.toLowerCase()
  const password = body?.password ?? ''

  if (!email || !password) {
    return fail(event, ResponseCode.BadRequest, '请输入邮箱与密码', null)
  }

  const config = useRuntimeConfig()

  let userRow = null as Awaited<ReturnType<typeof findUserByEmail>>
  try {
    userRow = await findUserByEmail(email)
  }
  catch {
    userRow = null
  }

  // 开发模式：无表或本地联调时可走环境变量账号
  if (!userRow && config.authDevMode && config.devAuthEmail && config.devAuthPassword) {
    if (email === config.devAuthEmail && password === config.devAuthPassword) {
      const token = await signAccessToken({
        sub: '0',
        email,
        role: 'admin',
        membershipUntil: null,
        membershipPlan: null,
      })
      setAuthCookie(event, token)
      return ok(event, {
        user: {
          id: '0',
          email,
          role: 'admin' as const,
          membershipUntil: null,
          membershipPlan: null,
        },
        token,
      }, '登录成功')
    }
  }

  if (!userRow) {
    return fail(event, ResponseCode.Unauthorized, '邮箱或密码错误', null)
  }

  const match = await bcrypt.compare(password, userRow.password_hash)
  if (!match) {
    return fail(event, ResponseCode.Unauthorized, '邮箱或密码错误', null)
  }

  const user = rowToAuthUser(userRow)
  const token = await signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    membershipUntil: user.membershipUntil,
    membershipPlan: user.membershipPlan,
  })
  setAuthCookie(event, token)

  return ok(event, { user, token }, '登录成功')
})
