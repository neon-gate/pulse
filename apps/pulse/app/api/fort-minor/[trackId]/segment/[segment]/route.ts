// GET /api/fort-minor/[trackId]/segment/[segment]/route.ts
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackId: string; segment: string }> }
) {
  const { trackId, segment: segmentFile } = await params
  const filePath = path.join(
    process.cwd(),
    'data',
    'stub',
    trackId,
    segmentFile
  )

  const segment = await readFile(filePath)

  return new NextResponse(segment, {
    headers: {
      'Content-Type': 'video/mp2t'
    }
  })
}
