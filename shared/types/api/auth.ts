import type { MemberVipType } from '~~/shared/types/db/order'
import type { User } from '~~/shared/types/db/user'

/** 注册 / 登录请求体 */
export type AuthRegisterBody = {
  username: string
  email: string
  password: string
  /** 邮箱收到的 6 位数字验证码 */
  emailCode: string
  phone?: string
}

export type AuthLoginBody = {
  /** 登录仅支持邮箱 */
  email: string
  password: string
}

/** 发送邮箱验证码 */
export type SendEmailCodeBody = {
  email: string
}

export type SendEmailCodeData = {
  ok: true
}

/** 返回给前端的用户（无密码字段） */
export type AuthUserPayload = Omit<User, 'deleted_at'> & {
  /** 最近一笔支付成功订单的套餐；非 VIP 或未查到订单时为 null */
  membership_vip_type: MemberVipType | null
}

/** 登录 / 注册成功时的 data */
export type AuthTokenData = {
  token: string
  user: AuthUserPayload
}

/** 上传头像成功后的 data */
export type UserAvatarData = {
  user: AuthUserPayload
}
