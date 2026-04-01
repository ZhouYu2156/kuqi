import { deleteCookie, getCookie, getHeader, setCookie, type H3Event } from 'h3'
import { verifyAccessToken } from '~~/server/utils/jwt'
import type { AuthUser, JwtPayload, MembershipPlan, UserRole } from '~~/shared/types/auth'

const COOKIE_NAME = 'jk_auth'

export function getBearerToken(event: H3Event): string | null {
  const auth = getHeader(event, 'authorization')
  if (auth?.startsWith('Bearer ')) {
    return auth.slice(7).trim() || null
  }
  const cookieTok = getCookie(event, COOKIE_NAME)
  return cookieTok || null
}

export async function getPayloadFromRequest(event: H3Event): Promise<JwtPayload | null> {
  const raw = getBearerToken(event)
  if (!raw) return null
  try {
    return await verifyAccessToken(raw)
  }
  catch {
    return null
  }
}

export async function getAuthUser(event: H3Event): Promise<AuthUser | null> {
  const p = await getPayloadFromRequest(event)
  if (!p?.sub) return null
  return {
    id: p.sub,
    email: p.email,
    role: (p.role as UserRole) ?? 'user',
    membershipUntil: p.membershipUntil,
    membershipPlan: (p.membershipPlan as MembershipPlan) ?? null,
  }
}

export function setAuthCookie(event: H3Event, token: string, maxAgeSec = 60 * 60 * 24 * 7) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSec,
  })
}

export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export { COOKIE_NAME }
