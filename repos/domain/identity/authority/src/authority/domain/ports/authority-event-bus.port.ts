import { EventBus } from '@pack/kernel'

import type { AuthorityEventMap } from '@domain/events'

export abstract class AuthorityEventBusPort extends EventBus<AuthorityEventMap> {}
