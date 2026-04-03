import nodemailer from 'nodemailer'
import { useRuntimeConfig } from '#imports'

/** 仅使用 runtimeConfig.smtpPort（字符串或数字）；未配置或无效时回退 465 */
function resolveSmtpPort(raw: unknown): number {
  if (raw === undefined || raw === null) return 465
  if (typeof raw === 'number') return Number.isFinite(raw) && raw > 0 ? raw : 465
  const s = String(raw).trim()
  if (!s) return 465
  const n = Number(s)
  return Number.isFinite(n) && n > 0 ? n : 465
}

/**
 * 发件人：若 EMAIL_FROM 仅为「显示名」无 @，则自动变为 `"显示名" <发件邮箱>`，避免无效 From。
 */
function formatMailFrom(mailFrom: string, smtpUser: string): string {
  const m = mailFrom.trim()
  if (!m) return smtpUser
  if (m.includes('@')) return m
  const safe = m.replace(/"/g, '\\"')
  return `"${safe}" <${smtpUser}>`
}

/**
 * 发送验证码邮件（QQ：授权码填 EMAIL_HOST_PASSWORD；465 SSL 或 587 STARTTLS）。
 * 未配置账号密码时仅打日志。
 */
export async function sendVerificationEmail(to: string, code: string): Promise<void> {
  const c = useRuntimeConfig()
  const user = String(c.smtpUser ?? '').trim()
  const pass = String(c.smtpPass ?? '').trim()
  let host = String(c.smtpHost ?? '').trim()
  const mailFromRaw = String(c.mailFrom ?? '').trim()
  const portSafe = resolveSmtpPort(c.smtpPort)
  const useRequireTls =
    portSafe === 587 && (c.emailUseTls === true || String(c.emailUseTls ?? '') === 'true')

  if (!user || !pass) {
    console.info(`[邮箱验证码] 未配置 EMAIL_HOST_USER/EMAIL_HOST_PASSWORD，仅日志 to=${to} code=${code}`)
    return
  }

  if (!host) {
    host = 'smtp.qq.com'
  }

  /** 465 为 SSL；587 等为 STARTTLS（secure=false），默认不强制 requireTLS，由 nodemailer 协商 */
  const secure = portSafe === 465

  if (import.meta.dev) {
    const mask = user.includes('@') ? `${user.slice(0, 2)}***@${user.split('@')[1]}` : '***'
    console.info('[mailer] SMTP 连接参数', { host, port: portSafe, secure, requireTLS: useRequireTls, user: mask })
  }

  const transporter = nodemailer.createTransport({
    host,
    port: portSafe,
    secure,
    ...(useRequireTls ? { requireTLS: true } : {}),
    auth: { user, pass },
  })

  const from = formatMailFrom(mailFromRaw, user)
  const subject = '邮箱验证码'
  const text = `您的验证码为：${code}，30 分钟内有效。如非本人操作请忽略。`
  const html = `<p>您的验证码为：<strong style="font-size:18px;letter-spacing:2px">${code}</strong></p><p>30 分钟内有效。如非本人操作请忽略。</p>`

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })
}
