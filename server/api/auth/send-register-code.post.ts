import { defineEventHandler, readBody } from 'h3'
import { ok, fail } from '~~/server/utils/apiResponse'
import { findUserByEmail } from '~~/server/lib/userRepo'
import { canSendAgain, markSent, saveRegisterOtp } from '~~/server/lib/registerOtp'
import { ResponseCode } from '~~/shared/types/common'

function random4Digits(): string {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = body?.email?.trim()?.toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail(event, ResponseCode.BadRequest, '请输入有效邮箱', null)
  }

  const exists = await findUserByEmail(email)
  if (exists) {
    return fail(event, ResponseCode.Conflict, '该邮箱已注册，请直接登录', null)
  }

  const gate = canSendAgain(email)
  if (!gate.ok) {
    const ws = gate.waitSec ?? 60
    return fail(event, ResponseCode.TooManyRequests, `发送太频繁，请 ${ws} 秒后再试`, { waitSec: ws })
  }

  const code = random4Digits()
  saveRegisterOtp(email, code)
  markSent(email)

  // TODO: 生产环境接入邮件服务（SMTP / 第三方）发送验证码
  console.info(`[send-register-code] ${email} => ${code}`)

  const config = useRuntimeConfig()
  const expose = config.public?.exposeRegisterCode === true

  if (expose) {
    return ok(event, { devCode: code }, '验证码已生成（仅开发环境返回）')
  }

  return ok(event, { sent: true }, '验证码已发送，请查收邮箱')
})
