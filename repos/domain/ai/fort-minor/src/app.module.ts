import { Global, Module } from '@nestjs/common'

import { NatsModule, RedisModule, MinioModule } from '@env/core'
import { HealthController } from '@interface/http'

import { FortMinorModule } from './fort-minor/fort-minor.module'

@Global()
@Module({
  imports: [NatsModule, RedisModule, MinioModule, FortMinorModule],
  exports: [NatsModule, RedisModule, MinioModule],
  controllers: [HealthController]
})
export class AppModule {}
