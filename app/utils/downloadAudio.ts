/**
 * 使用音频直链（如酷狗 play_url）拉取为 Blob，并回调进度。
 * 若 CDN 未返回 CORS 头，浏览器可能拦截 fetch，需用户网络环境支持。
 */
export async function downloadAudioFromUrl(
  resourceUrl: string,
  onProgress: (ratio: number) => void,
): Promise<{ blob: Blob; contentType: string | null }> {
  const res = await fetch(resourceUrl, {
    mode: 'cors',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  const total = Number(res.headers.get('content-length')) || 0
  const contentType = res.headers.get('content-type')
  const reader = res.body?.getReader()
  if (!reader) {
    throw new Error('无法读取响应体')
  }

  const chunks: Uint8Array[] = []
  let loaded = 0

  if (total > 0) {
    onProgress(0)
  } else {
    onProgress(-1)
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      chunks.push(value)
      loaded += value.length
      if (total > 0) {
        onProgress(Math.min(1, loaded / total))
      }
    }
  }

  onProgress(1)

  const blob = new Blob(chunks as BlobPart[], {
    type: contentType || 'audio/mpeg',
  })
  return { blob, contentType }
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const safe = filename.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 180)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = safe || 'download.mp3'
  a.rel = 'noopener'
  a.click()
  URL.revokeObjectURL(a.href)
}
