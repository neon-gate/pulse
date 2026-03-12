import { EventBus } from '@repo/kernel'

import type { AuthEventMap } from '@domain/events'

export abstract class AuthEventBusPort extends EventBus<AuthEventMap> {}
