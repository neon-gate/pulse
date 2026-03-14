import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, WebSocket } from 'ws'

export interface WsEventMessage {
  type: 'event'
  subject: string
  timestamp: string
  payload: unknown
}

/// WebSocket gateway that forwards all NATS track events to connected clients.
///
/// Connect to `ws://host:4001/events` to receive the live event stream.
@WebSocketGateway({ path: '/events' })
export class TrackGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server

  handleConnection(client: WebSocket): void {
    console.log(`[Backstage] Client connected. Total: ${this.server.clients.size}`)
    client.send(
      JSON.stringify({ type: 'connected', message: 'Backstage event stream ready' })
    )
  }

  handleDisconnect(): void {
    console.log(`[Backstage] Client disconnected. Total: ${this.server.clients.size}`)
  }

  /// Broadcast a structured event to all connected WebSocket clients.
  broadcast(subject: string, payload: unknown): void {
    const message: WsEventMessage = {
      type: 'event',
      subject,
      timestamp: new Date().toISOString(),
      payload
    }

    const serialized = JSON.stringify(message)

    for (const client of this.server.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(serialized)
      }
    }
  }
}
