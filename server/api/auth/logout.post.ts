import { defineEventHandler } from 'h3'
import { ok } from '~~/server/utils/apiResponse'
import { clearAuthCookie } from '~~/server/utils/authContext'

export default defineEventHandler(async (event) => {
  clearAuthCookie(event)
  return ok(event, { done: true }, '已退出')
})
