import { NextResponse } from 'next/server'
import {
  adminAccessCookie,
  adminCookieOptions,
  adminRefreshCookie,
  adminSessionCookie,
  createAdminSessionToken,
  getAdminCredentialEmail,
  getAdminCredentialPassword,
  getSupabaseAuthClient,
} from '@/lib/admin-auth'
import { checkRateLimit, readJsonBody } from '@/lib/request-security'

type LoginBody = {
  email?: unknown
  password?: unknown
}

export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request, 'admin-login', 6, 10 * 60 * 1000)
  if (rateLimited) return rateLimited

  const body = await readJsonBody<LoginBody>(request, 2048)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: 'メールアドレスとパスワードを入力してください。' }, { status: 400 })
  }

  if (email === getAdminCredentialEmail() && password === getAdminCredentialPassword()) {
    const response = NextResponse.json({ ok: true })
    response.cookies.set(adminSessionCookie, await createAdminSessionToken(email), {
      ...adminCookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    })
    response.cookies.delete(adminAccessCookie)
    response.cookies.delete(adminRefreshCookie)
    return response
  }

  const client = getSupabaseAuthClient()
  if (!client) {
    return NextResponse.json({ ok: false, message: 'ログインできませんでした。メールとパスワードを確認してください。' }, { status: 401 })
  }

  const { data, error } = await client.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return NextResponse.json({ ok: false, message: 'ログインできませんでした。メールとパスワードを確認してください。' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(adminAccessCookie, data.session.access_token, {
    ...adminCookieOptions,
    maxAge: data.session.expires_in ?? 3600,
  })
  response.cookies.set(adminRefreshCookie, data.session.refresh_token, {
    ...adminCookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  })
  response.cookies.delete(adminSessionCookie)

  return response
}
