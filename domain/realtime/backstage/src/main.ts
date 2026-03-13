import { NestFactory } from '@nestjs/core'
import { WsAdapter } from '@nestjs/platform-ws'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useWebSocketAdapter(new WsAdapter(app))

  const port = Number(process.env.PORT ?? 4001)
  await app.listen(port)

  console.log(`[Backstage] HTTP server running on port ${port}`)
  console.log(`[Backstage] WebSocket endpoint: ws://localhost:${port}/events`)
}

bootstrap().catch((error: unknown) => {
  console.error('[Backstage] Startup failed:', error)
  process.exit(1)
})
