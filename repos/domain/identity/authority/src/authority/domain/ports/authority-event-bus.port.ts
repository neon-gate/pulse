import { EventBus } from '@repo/kernel'

import type { AuthorityEventMap } from '@domain/events'

export abstract class AuthorityEventBusPort extends EventBus<AuthorityEventMap> {}
