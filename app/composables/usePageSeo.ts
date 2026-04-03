import { SITE_NAME } from '~~/shared/constants/seo'

export type PageSeoOptions = {
  /**
   * 页面标题段：首页可传站点名；其余为「某某 | 站点名」。
   * 传 `isHome: true` 时最终标题仅为站点名（README：标题极客兔资源网）。
   */
  title: string
  description?: string
  noindex?: boolean
  /** 为 true 时 document title 仅为站点名，不拼接「标题 | 站点名」 */
  isHome?: boolean
}

/**
 * 统一设置 title、description、Open Graph、Twitter Card、robots、keywords。
 * 配置 `NUXT_PUBLIC_SITE_URL` 后由 `app.vue` 注入 canonical 与 JSON-LD；此处设置 `og:url`。
 */
export function usePageSeo(opts: PageSeoOptions) {
  const config = useRuntimeConfig()

  const siteName = (config.public.siteName as string) || SITE_NAME
  const defaultDesc = (config.public.seoDescription as string) || ''
  const description = opts.description ?? defaultDesc
  const keywords = (config.public.seoKeywords as string) || ''

  const siteUrl = String(config.public.siteUrl || '')
    .trim()
    .replace(/\/$/, '')
  const route = useRoute()
  const path = route.path || '/'
  const canonical = siteUrl ? `${siteUrl}${path === '/' ? '' : path}` : ''

  const fullTitle = opts.isHome ? siteName : `${opts.title} | ${siteName}`

  const ogImage = String(config.public.ogImage || '').trim()

  useSeoMeta({
    title: fullTitle,
    description,
    keywords,
    ogTitle: fullTitle,
    ogDescription: description,
    ogType: 'website',
    ogSiteName: siteName,
    ogLocale: 'zh_CN',
    ...(canonical ? { ogUrl: canonical } : {}),
    ...(ogImage ? { ogImage, twitterImage: ogImage } : {}),
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    robots: opts.noindex ? 'noindex, nofollow' : 'index, follow',
  })
}
