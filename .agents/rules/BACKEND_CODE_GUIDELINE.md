---
alwaysApply: true
---

# Back-End Code Guideline

## Circuit Breaker Scope
Circuit breakers from `@pack/patterns` are only for synchronous calls to other services (HTTP, gRPC, database clients, etc.). Do not wrap asynchronous event emission or background jobs with them—events are fire-and-forget and keeping the breaker in the sync path keeps it reliable and predictable.

## Clean Architecture Per Microservice
Each microservice must follow Clean Architecture with a single domain and the folders `application`, `domain`, `infra`, and `interface`. Each microservice contains a single module under those folders.

Example:
- `domain/identity/authentication/src/auth/application`
- `domain/identity/authentication/src/auth/domain`
- `domain/identity/authentication/src/auth/infra`
- `domain/identity/authentication/src/auth/interface`
- `domain/identity/authentication/src/auth/auth.module.ts`

## No Shared Infrastructure Between Microservices
Infrastructure code is private to each microservice. A microservice must never import another microservice's `infra` layer (adapters, providers, config, clients, or wiring). Shared contracts and reusable primitives belong in workspace packages (for example `@pack/kernel`).

## Ports As Abstract Classes
Ports are abstract classes, not TypeScript interfaces. Adapters are classes implementing those ports.

Do:
```ts
export abstract class EventBusPort {
  abstract emit(event: string, payload: unknown): Promise<void>
}
```

Don't:
```ts
export interface EventBusPort {
  emit(event: string, payload: unknown): Promise<void>
}
```

## Use Cases As Classes
Each use case must be a class and extend the Kernel abstract use-case base class.

Do:
```ts
export class StartPlaybackUseCase extends UseCase<StartInput, StartResult> {
  async execute(input: StartInput) {
    return input
  }
}
```

## Entities Are Kernel Entities
Entities must be classes and extend the Kernel entity base class.

Do:
```ts
export class Track extends Entity<TrackProps> {}
```

## Events Are Kernel Events
Events must be classes and extend the Kernel `Event` abstract class.

Do:
```ts
export class StreamStarted extends Event<StreamStartedPayload> {
  get eventName() {
    return 'stream.started'
  }

  get eventVersion() {
    return 1
  }
}
```

## Value Objects Are Kernel ValueObjects
Value objects must be classes and extend the Kernel `ValueObject` abstract class.

Do:
```ts
export class Email extends ValueObject<{ value: string }> {
  get value() {
    return this.props.value
  }
}
```

## DTOs Are Classes With Decorators
DTOs are classes, not interfaces, and must use NestJS decorators.

Do:
```ts
export class LoginDto {
  @IsEmail()
  email!: string

  @MinLength(8)
  password!: string
}
```

## NestJS Decorators Are Mandatory
Every NestJS class must use the correct decorators and follow NestJS opinionated patterns. Do not create arbitrary patterns that bypass NestJS DI and lifecycle behavior.
