import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import type { TreasuredManifestItem } from '~~/shared/types/api/music'
import manifestJson from '~~/shared/data/treasured-musics.json'

export function getTreasuredManifest(): TreasuredManifestItem[] {
  return manifestJson as TreasuredManifestItem[]
}

export function getTreasuredById(id: string): TreasuredManifestItem | null {
  const q = id.trim()
  if (!q) return null
  return getTreasuredManifest().find((x) => x.id === q) ?? null
}

/** `/musics/xx/a.mp3` → `<cwd>/public/musics/xx/a.mp3` */
export function resolvePublicFilePath(publicUrlPath: string): string | null {
  const p = publicUrlPath.trim().replace(/^\//, '')
  if (!p || p.includes('..') || p.includes('\\')) return null
  return join(process.cwd(), 'public', p)
}

export async function readUtf8IfExists(publicUrlPath: string): Promise<string> {
  const abs = resolvePublicFilePath(publicUrlPath)
  if (!abs || !existsSync(abs)) return ''
  try {
    return await readFile(abs, 'utf-8')
  } catch {
    return ''
  }
}
