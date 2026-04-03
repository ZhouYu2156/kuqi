import { setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const base = String(config.public.siteUrl || '')
    .trim()
    .replace(/\/$/, '')
  const lines = ['User-agent: *', 'Allow: /', 'Disallow: /dashboard', 'Disallow: /api/', '']
  if (base) {
    lines.push(`Sitemap: ${base}/sitemap.xml`)
  }
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return lines.join('\n')
})
