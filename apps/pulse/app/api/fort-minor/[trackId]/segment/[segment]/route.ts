// GET /api/fort-minor/[trackId]/segment/[segment]/route.ts
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: { trackId: string; segment: string } }
) {
  const filePath = path.join(
    process.cwd(),
    'data',
    'stub',
    params.trackId,
    params.segment
  )

  const segment = await readFile(filePath)

  return new NextResponse(segment, {
    headers: {
      'Content-Type': 'video/mp2t'
    }
  })
}
