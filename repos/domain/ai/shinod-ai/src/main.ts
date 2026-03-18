import { NestFactory } from '@nestjs/core'

import { requireNumberEnv } from '@env/lib'
import { AppModule } from './shinod-ai.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(requireNumberEnv('PORT'))
}

bootstrap().catch((error: unknown) => {
  console.error('[Shinod-AI] Startup failed:', error)
  process.exit(1)
})
