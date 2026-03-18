import { EventBus } from '@pack/kernel'

import type { MockingbirdEventMap } from '@domain/events'

export abstract class MockingbirdEventBusPort extends EventBus<MockingbirdEventMap> {}
