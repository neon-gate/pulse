import {
  ErrorFactoryService,
  ErrorService,
  isLoginBodyValid,
  LoginService
} from '@api/auth'
import { HTTP_ERROR_MAP } from '@api/transport/http'
import { type NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()

  try {
    const body = await request.json()

    const loginService = new LoginService(isLoginBodyValid(body), requestId)

    return await loginService.login()
  } catch (error) {
    const errorFactory = new ErrorFactoryService(HTTP_ERROR_MAP)
    const errorService = new ErrorService(errorFactory)

    return errorService.normalizeRouteError(error, requestId)
  }
}
