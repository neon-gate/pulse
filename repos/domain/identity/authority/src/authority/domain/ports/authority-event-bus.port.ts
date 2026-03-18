import { EventBus } from '@pack/event-bus'

import type { AuthorityEventMap } from '@domain/events'

export abstract class AuthorityEventBusPort extends EventBus<AuthorityEventMap> {}
