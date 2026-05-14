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
  '/dictionary/admin',
  '/museum/admin',
  '/music/admin',
  '/api/dictionary/images',
  '/api/museum/upload',
  '/api/music/upload',
  '/api/nfc/individuals',
  '/api/nfc/individuals/care',
  '/api/nfc/individuals/photos',
  '/api/nfc/verify',
]

const publicOpenPaths = ['/', '/_not-found', '/shokuchudoku', '/lab', '/music', '/museum', '/legal']

const publicOpenPrefixes = [
  '/_next',
  '/api/analytics',
  '/api/admin',
  '/api/dictionary/images',
  '/api/museum',
  '/api/music',
  '/api/nfc/verify',
  '/api/shokuchudoku',
  '/admin',
  '/dictionary/admin',
  '/museum/admin',
  '/music/admin',
  '/fonts',
  '/legal',
  '/music',
  '/museum',
  '/shokuchudoku',
]

const publicOpenFiles = [
  '/apple-icon.png',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon-48x48.png',
  '/icon.png',
  '/robots.txt',
  '/site.webmanifest',
]

function isProtected(pathname: string) {
  if (pathname === '/admin/login') return false
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function isPublicOpen(pathname: string) {
  if (publicOpenPaths.includes(pathname) || publicOpenFiles.includes(pathname)) return true
  return publicOpenPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/admin/login'
  url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return withSecurityHeaders(NextResponse.redirect(url))
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()')
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https://*.supabase.co https://i.ytimg.com https://upload.wikimedia.org",
      "media-src 'self' blob:",
      "font-src 'self' data:",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
      "frame-src https://www.youtube.com https://youtube.com",
    ].join('; '),
  )

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  return response
}

async function getAdminSessionResponse(request: NextRequest) {
  const adminSessionToken = request.cookies.get(adminSessionCookie)?.value
  if (await verifyAdminSessionToken(adminSessionToken)) {
    return withSecurityHeaders(NextResponse.next())
  }

  const client = getSupabaseAuthClient()
  if (!client) {
    return null
  }

  const accessToken = request.cookies.get(adminAccessCookie)?.value

  if (accessToken) {
    const { data } = await client.auth.getUser(accessToken)
    if (data.user) {
      return withSecurityHeaders(NextResponse.next())
    }
  }

  const refreshToken = request.cookies.get(adminRefreshCookie)?.value
  if (refreshToken) {
    const { data } = await client.auth.refreshSession({ refresh_token: refreshToken })
    if (data.session?.access_token && data.session.refresh_token) {
      const response = withSecurityHeaders(NextResponse.next())
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

  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/api/dictionary/images' && request.method === 'GET') {
    return withSecurityHeaders(NextResponse.next())
  }

  const adminResponse = await getAdminSessionResponse(request)

  if (!isProtected(pathname)) {
    if (isPublicOpen(pathname) || adminResponse) {
      return adminResponse ?? withSecurityHeaders(NextResponse.next())
    }

    const url = request.nextUrl.clone()
    url.pathname = '/_not-found'
    url.search = ''
    return withSecurityHeaders(NextResponse.rewrite(url, { status: 404 }))
  }

  if (adminResponse) {
    return adminResponse
  }

  const response = redirectToLogin(request)
  response.cookies.delete(adminAccessCookie)
  response.cookies.delete(adminRefreshCookie)
  response.cookies.delete(adminSessionCookie)
  return response
}

export const config = {
  matcher: [
    '/((?!.*\\.).*)',
    '/admin/:path*',
    '/dictionary/admin/:path*',
    '/museum/admin/:path*',
    '/music/admin/:path*',
    '/api/dictionary/images/:path*',
    '/api/museum/upload/:path*',
    '/api/music/upload/:path*',
    '/api/nfc/individuals/:path*',
    '/api/nfc/individuals/care/:path*',
    '/api/nfc/verify/:path*',
  ],
}
