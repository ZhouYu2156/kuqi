import { SignJWT, jwtVerify } from 'jose'
import { useRuntimeConfig } from '#imports'

function getSecret(): Uint8Array {
  const config = useRuntimeConfig()
  const s = config.jwtSecret || 'dev-only-set-JWT_SECRET-in-env'
  return new TextEncoder().encode(s)
}

/** JWT 载荷仅包含 username + email（用于签名与校验） */
export type JwtUserClaims = {
  username: string
  email: string
}

export async function signAccessToken(claims: JwtUserClaims): Promise<string> {
  const secret = getSecret()
  return await new SignJWT({
    username: claims.username,
    email: claims.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyAccessToken(token: string): Promise<JwtUserClaims> {
  const secret = getSecret()
  const { payload } = await jwtVerify(token, secret)
  const username = String(payload.username ?? '').trim()
  const email = String(payload.email ?? '').trim().toLowerCase()
  if (!username || !email) {
    throw new Error('invalid token: missing username or email')
  }
  return { username, email }
}
