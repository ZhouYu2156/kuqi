import { createError, readMultipartFormData } from 'h3'
import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import { deleteAvatarFileIfManaged, getAvatarUploadDir } from '~~/server/utils/avatarUpload'
import {
  buildAuthUserPayload,
  fetchUserById,
  findUserByEmail,
  updateUserAvatar as persistUserAvatar,
} from '~~/server/utils/userRepo'
import { ResponseCode } from '~~/shared/types'
import type { UserAvatarData } from '~~/shared/types/api/auth'
import { UnionResponseResult } from '~~/shared/utils'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_EXT = new Set(['png', 'jpg', 'jpeg', 'gif'])

function extFromFilename(filename: string): string | null {
  const m = filename.toLowerCase().match(/\.([a-z0-9]+)$/)
  return m?.[1] ?? null
}

function validateImageMagic(buf: Buffer, ext: string): boolean {
  if (buf.length < 4) return false
  if (ext === 'png') {
    return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  }
  if (ext === 'jpg' || ext === 'jpeg') {
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
  }
  if (ext === 'gif') {
    return buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38
  }
  return false
}

export default defineEventHandler(async (event) => {
  const jwt = event.context.auth?.jwt
  if (!jwt?.email) {
    throw createError({
      statusCode: 401,
      data: { code: ResponseCode.Unauthorized, message: '请先登录', data: null },
    })
  }

  const userRow = await findUserByEmail(jwt.email)
  if (!userRow) {
    throw createError({
      statusCode: 404,
      data: { code: ResponseCode.NotFound, message: '用户不存在', data: null },
    })
  }

  const userId = Number(userRow.id)
  const oldAvatarUrl = userRow.avatar

  const parts = await readMultipartFormData(event)
  const filePart =
    parts?.find((p) => (p.name === 'file' || p.name === 'avatar') && p.filename && p.data?.length) ??
    parts?.find((p) => p.filename && p.data?.length)
  if (!filePart?.data?.length || !filePart.filename) {
    return UnionResponseResult(null as unknown as UserAvatarData, '请选择图片文件', ResponseCode.BadRequest)
  }

  if (filePart.data.length > MAX_BYTES) {
    return UnionResponseResult(null as unknown as UserAvatarData, '图片大小不能超过 5MB', ResponseCode.BadRequest)
  }

  const ext = extFromFilename(filePart.filename)
  if (!ext || !ALLOWED_EXT.has(ext)) {
    return UnionResponseResult(
      null as unknown as UserAvatarData,
      '仅支持 png、jpeg、jpg、gif 格式',
      ResponseCode.BadRequest,
    )
  }

  if (!validateImageMagic(filePart.data, ext)) {
    return UnionResponseResult(
      null as unknown as UserAvatarData,
      '文件内容与扩展名不符或不是有效图片',
      ResponseCode.BadRequest,
    )
  }

  const safeExt = ext === 'jpeg' ? 'jpg' : ext
  const newName = `${userId}-${randomBytes(12).toString('hex')}.${safeExt}`
  const dir = getAvatarUploadDir()
  await mkdir(dir, { recursive: true })
  const absPath = join(dir, newName)
  const publicUrl = `/uploads/avatars/${newName}`

  await writeFile(absPath, filePart.data)

  try {
    await persistUserAvatar(userId, publicUrl)
  } catch {
    await deleteAvatarFileIfManaged(publicUrl)
    return UnionResponseResult(null as unknown as UserAvatarData, '保存头像失败', ResponseCode.ServerError)
  }

  await deleteAvatarFileIfManaged(oldAvatarUrl)

  const row = await fetchUserById(userId)
  if (!row) {
    return UnionResponseResult(null as unknown as UserAvatarData, '读取用户信息失败', ResponseCode.ServerError)
  }

  return UnionResponseResult<UserAvatarData>({ user: await buildAuthUserPayload(row) }, '头像已更新')
})
