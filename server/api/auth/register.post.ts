import { readBody } from 'h3'
import type { AuthRegisterBody, AuthTokenData } from '~~/shared/types/api/auth'
import { ResponseCode } from '~~/shared/types'
import { UnionResponseResult } from '~~/shared/utils'
import { signAccessToken } from '~~/server/utils/jwt'
import { deleteEmailOtp, verifyEmailOtp } from '~~/server/utils/emailOtp'
import { buildAuthUserPayload, createUser, existsUsernameOrEmail, fetchUserById } from '~~/server/utils/userRepo'

const USERNAME_RE = /^[\w\u4e00-\u9fa5]{2,32}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_CODE_RE = /^\d{6}$/
const PHONE_CN_RE = /^1\d{10}$/

export default defineEventHandler(async (event) => {
  const body = await readBody<AuthRegisterBody>(event)
  const username = (body.username ?? '').trim()
  const email = (body.email ?? '').trim().toLowerCase()
  const password = body.password ?? ''
  const emailCode = (body.emailCode ?? '').trim()
  const phone = body.phone?.trim() || undefined

  if (!USERNAME_RE.test(username)) {
    return UnionResponseResult(null as unknown as AuthTokenData, '用户名为 2～32 位字母数字下划线或中文', ResponseCode.BadRequest)
  }
  if (!EMAIL_RE.test(email)) {
    return UnionResponseResult(null as unknown as AuthTokenData, '邮箱格式不正确', ResponseCode.BadRequest)
  }
  if (!EMAIL_CODE_RE.test(emailCode)) {
    return UnionResponseResult(null as unknown as AuthTokenData, '请输入 6 位数字邮箱验证码', ResponseCode.BadRequest)
  }
  if (password.length < 8) {
    return UnionResponseResult(null as unknown as AuthTokenData, '密码至少 8 位', ResponseCode.BadRequest)
  }
  if (phone && !PHONE_CN_RE.test(phone)) {
    return UnionResponseResult(null as unknown as AuthTokenData, '手机号格式不正确', ResponseCode.BadRequest)
  }

  if (!(await verifyEmailOtp(email, emailCode))) {
    return UnionResponseResult(null as unknown as AuthTokenData, '验证码错误或已过期，请重新获取', ResponseCode.BadRequest)
  }

  if (await existsUsernameOrEmail(username, email)) {
    return UnionResponseResult(null as unknown as AuthTokenData, '用户名或邮箱已被注册', ResponseCode.Conflict)
  }

  const userId = await createUser({ username, email, passwordPlain: password, phone })

  const row = await fetchUserById(userId)
  if (!row) {
    return UnionResponseResult(null as unknown as AuthTokenData, '注册成功但读取用户信息失败', ResponseCode.ServerError)
  }

  const user = await buildAuthUserPayload(row)
  await deleteEmailOtp(email)

  const token = await signAccessToken({
    username: user.username,
    email: user.email,
  })

  return UnionResponseResult<AuthTokenData>({ token, user }, '注册成功')
})
