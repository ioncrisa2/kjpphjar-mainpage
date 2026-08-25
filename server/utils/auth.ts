import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'

export function generateToken(username: string): string {
  const config = useRuntimeConfig()
  return jwt.sign({ username }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  })
}

export function verifyToken(token: string): { username: string } {
  const config = useRuntimeConfig()
  return jwt.verify(token, config.jwtSecret) as { username: string }
}
