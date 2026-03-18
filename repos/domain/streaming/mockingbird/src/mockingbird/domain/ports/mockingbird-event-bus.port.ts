import { EventBus } from '@pack/event-bus'

import type { MockingbirdEventMap } from '@domain/events'

export abstract class MockingbirdEventBusPort extends EventBus<MockingbirdEventMap> {}
