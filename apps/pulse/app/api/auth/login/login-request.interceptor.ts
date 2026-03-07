import { createHttpError, HttpErrorName } from '@api/transport/http'
import { loginSchema } from '@login/ui/form'
import { InternalAxiosRequestConfig } from 'axios'

export function loginRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const parsed = loginSchema.safeParse(config.data)
  if (!parsed.success) {
    throw createHttpError(HttpErrorName.ValidationError)
  }
  return config
}
