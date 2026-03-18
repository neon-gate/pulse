export type { EventContract } from './types/event-contract.type'
export type {
  ConsumeContext,
  ConsumeMiddleware,
  MessageHandler,
  PublishContext,
  PublishMiddleware
} from './middleware/types'
export { composeConsumeMiddleware, composePublishMiddleware } from './middleware/compose'
export { EventMap } from '@pack/kernel'
export { EventBus } from './ports/event-bus.port'
export {
  EventBusConnectionError,
  EventBusError,
  EventBusPublishError,
  EventBusSubscriptionError,
  EventBusValidationError,
  EventBusVersionMismatchError
} from './event-bus.error'
export { NatsPublisher } from './nats/nats-publisher.adapter'
export { NatsConsumer } from './nats/nats-consumer.adapter'
export { NoopPublisher } from './adapters/noop-publisher.adapter'
export { NoopConsumer } from './adapters/noop-consumer.adapter'
export { NatsEventBusAdapter } from './adapters/nats-event-bus.adapter'
export { NatsQueueConsumerAdapter } from './adapters/nats-queue-consumer.adapter'
export { NoopEventBusAdapter } from './adapters/noop-event-bus.adapter'
export { EventConsumer, type EventConsumerOptions } from './nest/decorators/event-consumer.decorator'
export { NatsConsumerRegistryService } from './nest/event-consumer.registry.service'
export { NatsConsumerModule } from './nest/nats-consumer.module'
export { NatsConfigFlag } from './nats/nats-config.enum'
export { NatsConnectionToken, natsConnectionProvider } from './nats/nats-connection.provider'
export { NatsLifecycleService } from './nats/nats-lifecycle.service'
