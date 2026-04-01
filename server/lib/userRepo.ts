import type { ResultSetHeader } from 'mysql2/promise'
import type { AuthUser, MembershipPlan, UserRole } from '~~/shared/types/auth'
import db from '~~/server/lib/db'

export type UserRow = {
  id: string | number
  email: string
  password_hash: string
  role: UserRole
  membership_until: Date | string | null
  membership_plan: string | null
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  try {
    const [rows] = await db.query(
      'SELECT id, email, password_hash, role, membership_until, membership_plan FROM users WHERE email = ? LIMIT 1',
      [email],
    )
    const list = rows as UserRow[]
    return list[0] ?? null
  }
  catch (e) {
    console.warn('[userRepo] findUserByEmail:', e)
    return null
  }
}

function parsePlan(raw: string | null): MembershipPlan {
  if (raw === 'monthly' || raw === 'annual') return raw
  return null
}

export function rowToAuthUser(row: UserRow): AuthUser {
  return {
    id: String(row.id),
    email: row.email,
    role: row.role,
    membershipUntil: row.membership_until
      ? new Date(row.membership_until).toISOString()
      : null,
    membershipPlan: parsePlan(row.membership_plan),
  }
}

export async function createUser(
  email: string,
  passwordHash: string,
  role: UserRole = 'user',
): Promise<string | null> {
  try {
    const [res] = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, role],
    )
    const header = res as ResultSetHeader
    const id = header.insertId
    return id != null ? String(id) : null
  }
  catch (e) {
    console.warn('[userRepo] createUser:', e)
    return null
  }
}
