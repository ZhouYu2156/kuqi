import { ResponseCode } from '~~/shared/types'
import type { TreasuredListItem } from '~~/shared/types/api/music'
import { UnionResponseResult } from '~~/shared/utils'
import { getTreasuredManifest } from '~~/server/utils/treasuredMusic'

export default defineEventHandler(() => {
  const list: TreasuredListItem[] = getTreasuredManifest().map((x) => ({
    id: x.id,
    song_name: x.song_name,
    author_name: x.author_name,
    cover: x.cover || '',
  }))
  return UnionResponseResult({ list }, 'ok', ResponseCode.Success)
})
