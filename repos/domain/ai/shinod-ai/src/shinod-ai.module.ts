import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { PetrifiedModule } from './modules/petrified/petrified.module'
import { FortMinorModule } from './modules/fort-minor/fort-minor.module'
import { StereoModule } from './modules/stereo/stereo.module'
import { HealthController } from './interface/http/health.controller'

@Module({
  imports: [
    CoreModule,
    PetrifiedModule,
    FortMinorModule,
    StereoModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
