import { NextResponse } from 'next/server'
import { listMuseumWorks } from '@/lib/museum-storage'

export const dynamic = 'force-dynamic'

export async function GET() {
  const works = await listMuseumWorks()
  return NextResponse.json({ works })
}
