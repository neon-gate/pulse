import { Module } from '@nestjs/common'

import { FakeCognitionModule } from './fake-cognition/fake-cognition.module'

@Module({ imports: [FakeCognitionModule] })
export class AppModule {}
