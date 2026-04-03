import type { CommonFields } from '~~/shared/types'

/** 用户角色 */
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Vip = 'vip',
}

/** 用户状态 */
export enum UserStatus {
  Active = 'active', // 登录状态
  Inactive = 'inactive', // 未登录状态
  Locked = 'locked', // 锁定状态
  Disabled = 'disabled', // 禁用状态
}

/** 用户基本信息 */
export interface User extends CommonFields {
  username: string
  email: string
  /** 0 未知 1 男 2 女 */
  sex: number
  phone?: string
  avatar?: string
  role: UserRole
  status: UserStatus
  last_login_at: string | null
  last_login_ip: string | null
}
