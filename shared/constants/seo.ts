/** README「SEO 优化」中的站点品牌名 */
export const SITE_NAME = '极客兔资源网'

/**
 * README 中三条说明合并，用于默认 meta description / Open Graph。
 */
export const SEO_DEFAULT_DESCRIPTION =
  '极客兔资源网为您提供市面优质稀缺资源，热心帮助广大网友找到自己想要的东西。' +
  '提供绝版数字媒体，包括思维与认知提升电子书、机密访谈音视频、绝版音乐与影视剧、历史内幕与真相、破局之道。' +
  '一站式满足你的需要，物美价廉的资源，就上极客兔资源网。'

export const SEO_KEYWORDS =
  '极客兔,极客兔资源网,稀缺资源,技术教程,数字媒体,电子书,绝版音乐,在线音乐,优质教程'

export const SEO_PAGE_DESCRIPTION = {
  home: `${SEO_DEFAULT_DESCRIPTION}`,
  music:
    '即刻听：在极客兔资源网搜索、播放海量音乐，优质稀缺资源与贴心体验，登录会员即可畅享。',
  tutorial: '优质教程与课程中心，极客兔资源网持续建设，以低价提供优质技术学习内容。',
  login: '登录极客兔资源网，访问会员专属资源与即刻听等服务。',
  register: '注册极客兔资源网账号，加入社区，获取优质稀缺资源与教程。',
  dashboard: '个人中心：管理资料、会员与订单。',
  orders: '会员订单与支付记录，极客兔资源网个人中心。',
} as const
