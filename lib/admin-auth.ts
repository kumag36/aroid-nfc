import { createClient } from '@supabase/supabase-js'

export const adminAccessCookie = 'zmk-admin-access-token'
export const adminRefreshCookie = 'zmk-admin-refresh-token'
export const adminSessionCookie = 'zmk-admin-session'

const defaultAdminEmail = 'kumajuko@gmail.com'
const defaultAdminPassword = '9090'
const encoder = new TextEncoder()

export function getSupabaseAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    return null
  }

  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export function getAdminCredentialEmail() {
  return process.env.ADMIN_EMAIL ?? defaultAdminEmail
}

export function getAdminCredentialPassword() {
  return process.env.ADMIN_PASSWORD ?? defaultAdminPassword
}

function getAdminSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    'zamakuri-admin-session'
  )
}

function base64UrlEncode(value: string) {
  if (typeof btoa === 'function') {
    return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '')
  }

  return Buffer.from(value, 'utf8').toString('base64url')
}

function base64UrlDecode(value: string) {
  if (typeof atob === 'function') {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return atob(padded)
  }

  return Buffer.from(value, 'base64url').toString('utf8')
}

async function signPayload(payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getAdminSessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false

  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return mismatch === 0
}

export async function createAdminSessionToken(email: string) {
  const payload = base64UrlEncode(
    JSON.stringify({
      email,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
    }),
  )
  const signature = await signPayload(payload)
  return `${payload}.${signature}`
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) return false

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expectedSignature = await signPayload(payload)
  if (!timingSafeEqual(expectedSignature, signature)) return false

  try {
    const decoded = JSON.parse(base64UrlDecode(payload)) as { email?: string; exp?: number }
    return decoded.email === getAdminCredentialEmail() && typeof decoded.exp === 'number' && decoded.exp > Date.now()
  } catch {
    return false
  }
}
