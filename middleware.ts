import { NextRequest, NextResponse } from 'next/server'
import {
  adminAccessCookie,
  adminRefreshCookie,
  adminSessionCookie,
  getSupabaseAuthClient,
  verifyAdminSessionToken,
} from './lib/admin-auth'

const protectedPrefixes = [
  '/admin',
  '/api/dictionary/images',
  '/api/museum/upload',
  '/api/music/upload',
  '/api/nfc/verify',
]

function isProtected(pathname: string) {
  if (pathname === '/admin/login') return false
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/admin/login'
  url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(url)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtected(pathname)) {
    return NextResponse.next()
  }

  const adminSessionToken = request.cookies.get(adminSessionCookie)?.value
  if (await verifyAdminSessionToken(adminSessionToken)) {
    return NextResponse.next()
  }

  const client = getSupabaseAuthClient()
  if (!client) {
    return redirectToLogin(request)
  }

  const accessToken = request.cookies.get(adminAccessCookie)?.value

  if (accessToken) {
    const { data } = await client.auth.getUser(accessToken)
    if (data.user) {
      return NextResponse.next()
    }
  }

  const refreshToken = request.cookies.get(adminRefreshCookie)?.value
  if (refreshToken) {
    const { data } = await client.auth.refreshSession({ refresh_token: refreshToken })
    if (data.session?.access_token && data.session.refresh_token) {
      const response = NextResponse.next()
      response.cookies.set(adminAccessCookie, data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: data.session.expires_in ?? 3600,
      })
      response.cookies.set(adminRefreshCookie, data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
      return response
    }
  }

  const response = redirectToLogin(request)
  response.cookies.delete(adminAccessCookie)
  response.cookies.delete(adminRefreshCookie)
  response.cookies.delete(adminSessionCookie)
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/dictionary/images/:path*',
    '/api/museum/upload/:path*',
    '/api/music/upload/:path*',
    '/api/nfc/verify/:path*',
  ],
}
