// GET /api/fort-minor/[trackId]/playlist

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> }
) {
  const { trackId } = await params
  const filePath = path.join(
    process.cwd(),
    'data',
    'stub',
    trackId,
    'playlist.m3u8'
  )

  const playlist = await readFile(filePath, 'utf-8')

  return new NextResponse(playlist, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl'
    }
  })
}
