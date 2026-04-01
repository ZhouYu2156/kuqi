import bcrypt from 'bcryptjs'
import { defineEventHandler, readBody } from 'h3'
import { createUser, findUserByEmail } from '~~/server/lib/userRepo'
import { ok, fail } from '~~/server/utils/apiResponse'
import { setAuthCookie } from '~~/server/utils/authContext'
import { signAccessToken } from '~~/server/utils/jwt'
import { verifyAndConsumeRegisterOtp } from '~~/server/lib/registerOtp'
import { ResponseCode } from '~~/shared/types/common'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email?: string
    password?: string
    code?: string
  }>(event)

  const email = body?.email?.trim()?.toLowerCase()
  const password = body?.password ?? ''
  const code = body?.code?.trim() ?? ''

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail(event, ResponseCode.BadRequest, '请输入有效邮箱', null)
  }
  if (password.length < 6) {
    return fail(event, ResponseCode.BadRequest, '密码至少 6 位', null)
  }
  if (!/^\d{4}$/.test(code)) {
    return fail(event, ResponseCode.BadRequest, '请输入 4 位数字验证码', null)
  }

  if (!verifyAndConsumeRegisterOtp(email, code)) {
    return fail(event, ResponseCode.BadRequest, '验证码错误或已过期，请重新获取', null)
  }

  const exists = await findUserByEmail(email)
  if (exists) {
    return fail(event, ResponseCode.Conflict, '该邮箱已注册，请直接登录', null)
  }

  const password_hash = await bcrypt.hash(password, 10)
  const id = await createUser(email, password_hash, 'user')
  if (!id) {
    return fail(event, ResponseCode.ServerError, '注册失败，请稍后重试', null)
  }

  const token = await signAccessToken({
    sub: id,
    email,
    role: 'user',
    membershipUntil: null,
    membershipPlan: null,
  })
  setAuthCookie(event, token)

  return ok(
    event,
    {
      user: {
        id,
        email,
        role: 'user' as const,
        membershipUntil: null,
        membershipPlan: null,
      },
      token,
    },
    '注册成功',
  )
})
