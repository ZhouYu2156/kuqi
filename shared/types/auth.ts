/** 用户身份：guest 随便看看 | user 白嫖黏性 | vip 铁杆 | admin 后台 */
export type UserRole = 'guest' | 'user' | 'vip' | 'admin'

/** 付费档位：月度 ¥12 音乐+下载+视频课；年度含额外认知资料 */
export type MembershipPlan = 'monthly' | 'annual' | null

export type AuthUser = {
  id: string
  email: string
  role: UserRole
  /** 会员到期时间 ISO */
  membershipUntil: string | null
  /** 当前合约档位，用于权益判断 */
  membershipPlan: MembershipPlan
}

export type LoginBody = {
  email: string
  password: string
}

export type LoginResult = {
  user: AuthUser
  token?: string
}

export type JwtPayload = {
  sub: string
  email: string
  role: UserRole
  membershipUntil: string | null
  membershipPlan: MembershipPlan
  iat?: number
  exp?: number
}

/** 音乐额度 / 开通引导 */
export type MusicQuotaData = {
  /** 今日剩余免费次数；会员或管理员为 null 表示不限制展示 */
  remainingFree: number | null
  dailyFreeLimit: number
  unlimited: boolean
  /** 是否可播放（未登录为 false） */
  canPlay: boolean
}
