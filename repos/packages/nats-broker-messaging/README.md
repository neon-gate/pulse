# @pack/nats-broker-messaging

NATS transport package for Pulse services.

## Purpose

This package provides transport-level messaging primitives for publishing and consuming
serialized event envelopes over NATS, while keeping domain abstractions in `@pack/kernel`.

## Key Concepts

- `EventPrimitive` comes from `@pack/kernel` and is the wire envelope.
- `EventContract` maps subject names to payload shapes.
- `NatsPublisher` publishes envelopes to subjects.
- `NatsConsumer` subscribes with queue-group semantics and validates envelopes.
- `EventBusError` hierarchy extends `DomainError` from kernel.

## Install (workspace)

```ts
import {
  NatsPublisher,
  NatsConsumer,
  NatsConnectionToken,
  natsConnectionProvider
} from '@pack/nats-broker-messaging'
```

## Publishing

```ts
import { NatsPublisher } from '@pack/nats-broker-messaging'
import type { EventPrimitive } from '@pack/kernel'

interface AuthorityContract {
  'authority.user.logged_in': {
    userId: string
    sessionId: string
  }
}

const publisher = new NatsPublisher<AuthorityContract>(connection)

const envelope: EventPrimitive<AuthorityContract['authority.user.logged_in']> = {
  eventId: crypto.randomUUID(),
  eventName: 'authority.user.logged_in',
  eventVersion: 1,
  aggregateId: 'usr_123',
  occurredOn: new Date(),
  payload: { userId: 'usr_123', sessionId: 'ses_123' }
}

await publisher.publish('authority.user.logged_in', envelope)
```

## Consuming

```ts
import { NatsConsumer } from '@pack/nats-broker-messaging'

interface TrackContract {
  'track.uploaded': {
    trackId: string
    sourceStorage: { bucket: string; key: string }
  }
}

const consumer = new NatsConsumer<TrackContract>(connection, 'petrified-workers')
consumer.subscribe('track.uploaded', async (envelope) => {
  console.log(envelope.eventId, envelope.payload.trackId)
})
```

## NestJS helpers

- `natsConnectionProvider` + `NatsConnectionToken` for DI wiring.
- `NatsLifecycleService` drains connections on shutdown.
- Optional declarative consumer tooling:
  - `@EventConsumer(subject, { queue })`
  - `NatsConsumerModule.forRoot()`

## Backward compatibility

Legacy exports are still provided to smooth migration:

- `EventBus` (transport contract with `emit`/`on`)
- `NatsEventBusAdapter`
- `NatsQueueConsumerAdapter`
- `NoopEventBusAdapter`

New code should prefer `NatsPublisher` and `NatsConsumer`.
