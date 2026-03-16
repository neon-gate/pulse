import { io, type Socket } from 'socket.io-client'

let sharedSocket: Socket | null = null

export function getOrCreateReasoningSocket(): Socket {
  if (!sharedSocket || !sharedSocket.connected) {
    sharedSocket = io(getBackstageSocketUrl(), {
      transports: ['websocket']
    })
  }

  return sharedSocket
}

export function disconnectReasoningSocket(): void {
  if (sharedSocket) {
    sharedSocket.disconnect()
    sharedSocket = null
  }
}

function getBackstageSocketUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BACKSTAGE_WS_URL
  const namespace = process.env.NEXT_PUBLIC_BACKSTAGE_WS_NAMESPACE

  if (!baseUrl) {
    throw new Error('Missing required env var NEXT_PUBLIC_BACKSTAGE_WS_URL')
  }

  if (!namespace) {
    throw new Error('Missing required env var NEXT_PUBLIC_BACKSTAGE_WS_NAMESPACE')
  }

  return `${baseUrl}${namespace}`
}
