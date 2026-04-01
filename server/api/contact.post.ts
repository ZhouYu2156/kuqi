import { defineEventHandler, readBody, createError } from 'h3'

type ContactBody = {
  name?: string
  contact?: string
  intent?: string
  budget?: string
  message?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event)

  if (!body?.name?.trim() || !body.contact?.trim() || !body.intent || !body.message?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: '请填写必填项',
    })
  }

  // MVP：仅校验并返回成功。后续可接入邮件、飞书、企业微信或数据库存储。
  if (import.meta.dev) {
    console.info('[contact]', {
      name: body.name,
      intent: body.intent,
      budget: body.budget,
    })
  }

  return {
    ok: true,
    message: '已收到你的意向，我们会尽快通过微信与你联系。',
  }
})
