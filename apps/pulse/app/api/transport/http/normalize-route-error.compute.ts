import { NextResponse } from 'next/server'
import { createHttpError } from './create-http-error.compute'
import { HttpErrorName } from './http-error-name.enum'
import { isHttpError } from './is-http-error.compute'

export function normalizeRouteError(
  error: unknown,
  requestId: string
): NextResponse {
  if (isHttpError(error)) {
    return NextResponse.json(
      { error: error.name, message: error.message },
      { status: error.status, headers: { 'x-request-id': requestId } }
    )
  }

  const fallback = createHttpError(HttpErrorName.InternalServerError)

  return NextResponse.json(
    { error: fallback.name, message: fallback.message },
    { status: fallback.status, headers: { 'x-request-id': requestId } }
  )
}
