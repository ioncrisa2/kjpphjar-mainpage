import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'
import type { H3Event } from 'h3'

export const AUTH_COOKIE_NAME = 'admin_token'

export interface AuthTokenPayload {
  /** User._id */
  sub: string
  /** User.tokenVersion saat token dibuat. */
  tv: number
}

function getJwtSecret() {
  const config = useRuntimeConfig()
  return process.env.JWT_SECRET || config.jwtSecret
}

export function generateToken(user: { id: string; tokenVersion: number }): string {
  const config = useRuntimeConfig()
  const expiresIn = process.env.JWT_EXPIRES_IN || config.jwtExpiresIn
  return jwt.sign({ tv: user.tokenVersion }, getJwtSecret(), {
    subject: user.id,
    expiresIn: expiresIn as SignOptions['expiresIn'],
  })
}

export function verifyToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, getJwtSecret())
  // Token format lama ({ username }) sengaja ditolak sehingga user login ulang.
  if (
    !payload ||
    typeof payload !== 'object' ||
    typeof payload.sub !== 'string' ||
    typeof payload.tv !== 'number'
  ) {
    throw new Error('Invalid token payload')
  }
  return { sub: payload.sub, tv: payload.tv }
}

export function setAuthCookie(event: H3Event, user: { id: string; tokenVersion: number }) {
  setCookie(event, AUTH_COOKIE_NAME, generateToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
}

export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, AUTH_COOKIE_NAME, { path: '/' })
}
