import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = Number(process.env.PORT ?? 7300)
  await app.listen(port)
  console.log(`[FakeCognition] Health check running on port ${port}`)
}

bootstrap().catch((error: unknown) => {
  console.error('[FakeCognition] Startup failed:', error)
  process.exit(1)
})
