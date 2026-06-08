import crypto from 'crypto'

const SALT_LEN = 16
const KEY_LEN = 64

const JWT_SECRET_RAW = process.env.JWT_SECRET
if (!JWT_SECRET_RAW && process.env.NODE_ENV === 'production') {
  throw new Error('[OpsFlow] CRITICAL: JWT_SECRET environment variable is not set. The application cannot start securely.')
}
const SECRET = JWT_SECRET_RAW || 'opsflow_dev_secret_CHANGE_ME_in_production'

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(SALT_LEN).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, KEY_LEN).toString('hex')
  return `${salt}:${derivedKey}`
}

export const verifyPassword = (password: string, hash: string): boolean => {
  try {
    const [salt, key] = hash.split(':')
    if (!salt || !key) return false
    const keyBuffer = Buffer.from(key, 'hex')
    const derivedKey = crypto.scryptSync(password, salt, KEY_LEN)
    return crypto.timingSafeEqual(keyBuffer, derivedKey)
  } catch (err) {
    return false
  }
}

export const signToken = (payload: any): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payloadB64 = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString('base64url') // 7 days
  const signature = crypto.createHmac('sha256', SECRET).update(`${header}.${payloadB64}`).digest('base64url')
  return `${header}.${payloadB64}.${signature}`
}

export const verifyToken = (token: string): any | null => {
  try {
    const [header, payloadB64, signature] = token.split('.')
    if (!header || !payloadB64 || !signature) return null
    const expectedSig = crypto.createHmac('sha256', SECRET).update(`${header}.${payloadB64}`).digest('base64url')
    if (expectedSig !== signature) return null
    
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
    if (payload.exp && payload.exp < Date.now()) return null
    return payload
  } catch (err) {
    return null
  }
}
