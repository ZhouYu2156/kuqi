import { existsSync } from 'node:fs'
import { unlink } from 'node:fs/promises'
import { join } from 'pathe'

const UPLOAD_PUBLIC_PREFIX = '/uploads/avatars'

/** 可写目录：优先项目根下 public/uploads/avatars（与静态 URL 一致） */
export function getAvatarUploadDir(): string {
  return join(process.cwd(), 'public', 'uploads', 'avatars')
}

/** 将数据库中的头像 URL 转为本地 public 下绝对路径；非本站 uploads 则返回 null（不删） */
export function absolutePathFromAvatarUrl(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl?.trim()) return null
  let path = avatarUrl.trim()
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      path = new URL(path).pathname
    } catch {
      return null
    }
  }
  if (!path.startsWith(`${UPLOAD_PUBLIC_PREFIX}/`)) return null
  const name = path.slice(UPLOAD_PUBLIC_PREFIX.length + 1)
  if (!name || name.includes('..') || name.includes('/') || name.includes('\\')) return null
  return join(getAvatarUploadDir(), name)
}

export async function deleteAvatarFileIfManaged(avatarUrl: string | null | undefined): Promise<void> {
  const abs = absolutePathFromAvatarUrl(avatarUrl)
  if (!abs || !existsSync(abs)) return
  try {
    await unlink(abs)
  } catch {
    /* ignore */
  }
}
