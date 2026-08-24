import jwt from 'jsonwebtoken'

export function generateToken(username: string): string {
  const config = useRuntimeConfig()
  return jwt.sign({ username }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as string,
  })
}

export function verifyToken(token: string): { username: string } {
  const config = useRuntimeConfig()
  return jwt.verify(token, config.jwtSecret) as { username: string }
}
