import { NextResponse } from 'next/server'
import { listMusicTracks } from '@/lib/music-storage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const tracks = await listMusicTracks()
  return NextResponse.json(
    { tracks },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    },
  )
}
