// GET /api/fort-minor/[trackId]/playlist

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: { trackId: string } }
) {
  const filePath = path.join(
    process.cwd(),
    'data',
    'stub',
    params.trackId,
    'playlist.m3u8'
  )

  const playlist = await readFile(filePath, 'utf-8')

  return new NextResponse(playlist, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl'
    }
  })
}
