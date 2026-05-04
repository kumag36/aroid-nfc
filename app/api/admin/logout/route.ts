import { NextResponse } from 'next/server'
import { adminAccessCookie, adminRefreshCookie, adminSessionCookie } from '@/lib/admin-auth'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(adminAccessCookie)
  response.cookies.delete(adminRefreshCookie)
  response.cookies.delete(adminSessionCookie)
  return response
}
