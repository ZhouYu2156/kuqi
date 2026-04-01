import { SignJWT, jwtVerify } from 'jose'
import type { JwtPayload } from '~~/shared/types/auth'

const textEncoder = new TextEncoder()

function getSecret() {
  const secret = useRuntimeConfig().jwtSecret
  if (!secret || String(secret).length < 16) {
    throw new Error('JWT_SECRET 未配置或长度不足（至少 16 字符）')
  }
  return textEncoder.encode(String(secret))
}

export async function signAccessToken(payload: JwtPayload, maxAgeSec = 60 * 60 * 24 * 7) {
  const secret = getSecret()
  const { sub, email, role, membershipUntil, membershipPlan } = payload
  return new SignJWT({
    email,
    role,
    membershipUntil,
    membershipPlan: membershipPlan ?? null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(secret)
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const secret = getSecret()
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
  return {
    sub: String(payload.sub ?? ''),
    email: String(payload.email ?? ''),
    role: (payload.role as JwtPayload['role']) ?? 'user',
    membershipUntil: payload.membershipUntil != null ? String(payload.membershipUntil) : null,
    membershipPlan: (payload.membershipPlan as JwtPayload['membershipPlan']) ?? null,
  }
}
