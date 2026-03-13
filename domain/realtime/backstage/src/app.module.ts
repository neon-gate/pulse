import { Module } from '@nestjs/common'

import { BackstageModule } from './backstage/backstage.module'

@Module({
  imports: [BackstageModule]
})
export class AppModule {}
