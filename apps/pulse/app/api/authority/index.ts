/* =================
  HTTP - Services
================== */
export { ErrorService } from '@api/transport/http/services/error-service/error.service'
export { ErrorFactoryService } from '@api/transport/http/services/error-service/error-factory.service'

/* =================
  Auth - Services
================== */
export { LoginService } from '@api/authority/login/services/login-service/login.service'

/* =================
  Auth - Types
================== */
export type { LoginResponse } from '@api/authority/login/login.types'

/* =================
  Auth - Guards
================== */
export { isLoginBodyValid } from '@api/authority/login/guards/is-login-body-valid.guard'

/* =================
  Axios - Instance
================== */
export { loginInstance } from '@api/authority/login/login.instance'
