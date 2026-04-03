import { setResponseHeader, setResponseStatus } from 'h3'

/** 对搜索引擎公开的静态路由（不含需登录的个人中心） */
const PUBLIC_PATHS = ['/', '/music', '/tutorial'] as const

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const base = String(config.public.siteUrl || '')
    .trim()
    .replace(/\/$/, '')
  if (!base) {
    setResponseStatus(event, 404)
    return ''
  }
  const lastmod = new Date().toISOString().slice(0, 10)
  const chunks = PUBLIC_PATHS.map((path) => {
    const loc = path === '/' ? base : `${base}${path}`
    const priority = path === '/' ? '1.0' : '0.8'
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks.join('\n')}
</urlset>`
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return body
})
