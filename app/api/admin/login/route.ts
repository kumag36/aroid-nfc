import { NextResponse } from 'next/server'
import { adminAccessCookie, adminCookieOptions, adminRefreshCookie, getSupabaseAuthClient } from '@/lib/admin-auth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: 'メールアドレスとパスワードを入力してください。' }, { status: 400 })
  }

  const client = getSupabaseAuthClient()
  if (!client) {
    return NextResponse.json({ ok: false, message: 'Supabase Auth が未設定です。' }, { status: 503 })
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

  return response
}