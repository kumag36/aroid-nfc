import { NextResponse } from 'next/server'
import { adminAccessCookie, adminRefreshCookie } from '@/lib/admin-auth'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(adminAccessCookie)
  response.cookies.delete(adminRefreshCookie)
  return response
}