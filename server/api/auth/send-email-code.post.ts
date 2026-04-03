import { readBody } from 'h3'
import type { SendEmailCodeBody, SendEmailCodeData } from '~~/shared/types/api/auth'
import { ResponseCode } from '~~/shared/types'
import { UnionResponseResult } from '~~/shared/utils'
import { deleteEmailOtp, generateEmailCode, getLastOtpSentAt, saveEmailOtp } from '~~/server/utils/emailOtp'
import { sendVerificationEmail } from '~~/server/utils/mailer'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** 两次发送最小间隔（秒） */
const SEND_COOLDOWN_SEC = 60

export default defineEventHandler(async (event) => {
  const body = await readBody<SendEmailCodeBody>(event)
  const email = (body.email ?? '').trim().toLowerCase()

  if (!email) {
    return UnionResponseResult(null as unknown as SendEmailCodeData, '请填写邮箱', ResponseCode.BadRequest)
  }
  if (!EMAIL_RE.test(email)) {
    return UnionResponseResult(null as unknown as SendEmailCodeData, '邮箱格式不正确', ResponseCode.BadRequest)
  }

  const last = await getLastOtpSentAt(email)
  if (last) {
    const deltaSec = (Date.now() - last.getTime()) / 1000
    if (deltaSec < SEND_COOLDOWN_SEC) {
      const wait = Math.ceil(SEND_COOLDOWN_SEC - deltaSec)
      return UnionResponseResult(
        null as unknown as SendEmailCodeData,
        `发送过于频繁，请 ${wait} 秒后再试`,
        ResponseCode.TooManyRequests,
      )
    }
  }

  const code = generateEmailCode()
  await saveEmailOtp(email, code)
  try {
    await sendVerificationEmail(email, code)
  } catch (e) {
    console.error('[send-email-code] SMTP 发送失败', e)
    await deleteEmailOtp(email)
    const msg = e instanceof Error ? e.message : String(e)
    const isAuth535 =
      /535|Invalid login|authentication failed/i.test(msg) ||
      (e as { responseCode?: number })?.responseCode === 535
    const hint = isAuth535
      ? 'SMTP 登录被拒绝（535）：请确认 QQ 邮箱已开启 SMTP、使用「授权码」而非登录密码，并稍后再试（避免频繁登录被限）。'
      : '邮件发送失败，请检查 SMTP 配置或稍后重试'
    return UnionResponseResult(null as unknown as SendEmailCodeData, hint, ResponseCode.ServerError)
  }

  return UnionResponseResult<SendEmailCodeData>({ ok: true }, '验证码已发送，30 分钟内有效')
})
