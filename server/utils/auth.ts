import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'

export function generateToken(username: string): string {
  const config = useRuntimeConfig()
  const secret = process.env.JWT_SECRET || config.jwtSecret
  const expiresIn = process.env.JWT_EXPIRES_IN || config.jwtExpiresIn
  return jwt.sign({ username }, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  })
}

export function verifyToken(token: string): { username: string } {
  const config = useRuntimeConfig()
  const secret = process.env.JWT_SECRET || config.jwtSecret
  return jwt.verify(token, secret) as { username: string }
}
