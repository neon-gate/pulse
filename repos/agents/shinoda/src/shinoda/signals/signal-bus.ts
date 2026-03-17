import { EventEmitter } from 'node:events'
import type { ShinodaEventMap, ShinodaEventName } from './shinoda-events'

class ShinodaSignalBus extends EventEmitter {
  override emit<K extends ShinodaEventName>(
    event: K,
    payload: ShinodaEventMap[K]
  ): boolean {
    return super.emit(event, payload)
  }

  override on<K extends ShinodaEventName>(
    event: K,
    listener: (payload: ShinodaEventMap[K]) => void
  ): this {
    return super.on(event, listener)
  }

  override once<K extends ShinodaEventName>(
    event: K,
    listener: (payload: ShinodaEventMap[K]) => void
  ): this {
    return super.once(event, listener)
  }

  override off<K extends ShinodaEventName>(
    event: K,
    listener: (payload: ShinodaEventMap[K]) => void
  ): this {
    return super.off(event, listener)
  }
}

export const signalBus = new ShinodaSignalBus()
