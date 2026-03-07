import axios from 'axios'
import { loginErrorResponseInterceptor } from './login-error-reponse.interceptor'
import { loginRequestInterceptor } from './login-request.interceptor'

export const instance = axios.create({
  baseURL: process.env.BFF_BASE_URL,
  timeout: Number(process.env.BFF_API_TIMEOUT_MS)
})

instance.interceptors.response.use(
  (response) => response,
  loginErrorResponseInterceptor
)

instance.interceptors.request.use(loginRequestInterceptor)
