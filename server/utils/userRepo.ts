import bcrypt from 'bcryptjs'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import type { AuthUserPayload } from '~~/shared/types/api/auth'
import { UserRole, UserStatus } from '~~/shared/types/db/user'
import db from '~~/server/db/index'
import { findLatestSuccessfulMemberVipType } from '~~/server/utils/memberOrderRepo'

export interface UserRow extends RowDataPacket {
  id: bigint
  username: string
  email: string
  sex: number
  phone: string | null
  avatar: string | null
  role: string
  status: string
  password_hash: string | null
  last_login_at: Date | null
  last_login_ip: string | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export function mapUserRow(row: UserRow): AuthUserPayload {
  const roleNorm = String(row.role ?? '')
    .trim()
    .toLowerCase() as AuthUserPayload['role']
  return {
    id: Number(row.id),
    username: row.username,
    email: row.email,
    sex: Number(row.sex ?? 0),
    phone: row.phone ?? undefined,
    avatar: row.avatar ?? undefined,
    role: roleNorm,
    status: row.status as AuthUserPayload['status'],
    last_login_at: row.last_login_at ? new Date(row.last_login_at).toISOString() : null,
    last_login_ip: row.last_login_ip,
    created_at: new Date(row.created_at).toISOString(),
    updated_at: new Date(row.updated_at).toISOString(),
    membership_vip_type: null,
  }
}

/** 同步登录/me 等接口：VIP 用户附带最近成功订单的套餐类型 */
export async function buildAuthUserPayload(row: UserRow): Promise<AuthUserPayload> {
  const base = mapUserRow(row)
  const uid = Number(row.id)
  if (base.role === UserRole.Vip) {
    const plan = await findLatestSuccessfulMemberVipType(uid)
    return { ...base, membership_vip_type: plan ?? null }
  }
  return base
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const e = email.trim().toLowerCase()
  const [rows] = await db.query<UserRow[]>(
    `SELECT id, username, email, sex, phone, avatar, role, status, password_hash,
            last_login_at, last_login_ip, created_at, updated_at, deleted_at
     FROM users
     WHERE deleted_at IS NULL AND email = ?
     LIMIT 1`,
    [e],
  )
  return rows[0] ?? null
}

export async function existsUsernameOrEmail(username: string, email: string): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT 1 AS ok FROM users WHERE deleted_at IS NULL AND (username = ? OR email = ?) LIMIT 1`,
    [username, email],
  )
  return rows.length > 0
}

export async function createUser(params: {
  username: string
  email: string
  passwordPlain: string
  phone?: string
}): Promise<number> {
  const hash = await bcrypt.hash(params.passwordPlain, 10)
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (username, email, sex, phone, password_hash, role, status)
     VALUES (?, ?, 0, ?, ?, ?, ?)`,
    [
      params.username,
      params.email,
      params.phone ?? null,
      hash,
      UserRole.User,
      UserStatus.Active,
    ],
  )
  return Number(result.insertId)
}

export async function updateLastLogin(userId: number, ip: string | null): Promise<void> {
  await db.execute(
    `UPDATE users SET last_login_at = CURRENT_TIMESTAMP(3), last_login_ip = ? WHERE id = ? AND deleted_at IS NULL`,
    [ip, userId],
  )
}

export async function updateUserAvatar(userId: number, avatarPublicUrl: string | null): Promise<void> {
  await db.execute(
    `UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP(3) WHERE id = ? AND deleted_at IS NULL`,
    [avatarPublicUrl, userId],
  )
}

export async function updateUserRole(userId: number, role: UserRole): Promise<void> {
  await db.execute(
    `UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP(3) WHERE id = ? AND deleted_at IS NULL`,
    [role, userId],
  )
}

export async function fetchUserById(id: number): Promise<UserRow | null> {
  const [rows] = await db.query<UserRow[]>(
    `SELECT id, username, email, sex, phone, avatar, role, status, password_hash,
            last_login_at, last_login_ip, created_at, updated_at, deleted_at
     FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
    [id],
  )
  return rows[0] ?? null
}
