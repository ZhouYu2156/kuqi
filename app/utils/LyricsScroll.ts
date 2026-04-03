/**
 * LRC 歌词解析与「当前唱词」索引计算（供播放器歌词区域使用）
 */

/** 单行 LRC：时间单位为秒（可含小数） */
export type LrcLine = {
  time: number
  text: string
}

const LRC_LINE_RE = /^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/

/**
 * 解析 LRC 文本为带时间轴的行（跳过非时间戳元数据行，如 [ar:xxx]）
 */
export function parseLrc(lyrics: string, delimiter: string | RegExp = /\r?\n/): LrcLine[] {
  const raw = lyrics.trim()
  if (!raw) return []

  const lines = raw.split(delimiter).map((l) => l.trim())
  const result: LrcLine[] = []

  for (const line of lines) {
    if (!line) continue
    const m = line.match(LRC_LINE_RE)
    if (!m) continue
    const min = Number(m[1])
    const sec = Number(m[2])
    const text = (m[3] ?? '').trim()
    if (text === '') continue

    result.push({
      time: min * 60 + sec,
      text,
    })
  }

  return result.sort((a, b) => a.time - b.time)
}

/**
 * 根据当前播放时间（秒）得到「当前应高亮」的行下标（与常见 LRC 行为一致）
 * - 早于第一句：-1
 * - 处于两句之间：取上一句下标
 */
export function findActiveLrcIndex(lines: LrcLine[], currentTimeSec: number): number {
  if (lines.length === 0) return -1
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line !== undefined && currentTimeSec < line.time) {
      return i - 1
    }
  }
  return lines.length - 1
}
