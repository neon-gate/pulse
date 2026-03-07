import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import {
  LoginUseCase,
  LogoutUseCase,
  MeUseCase,
  RefreshTokenUseCase,
  SignupUseCase
} from '@application/use-cases'
import { RefreshTokenPort, UserPort } from '@domain/ports'
import { requireStringEnv } from '@infra/env'
import { DbConfigFlag } from '@infra/db'
import {
  MongooseRefreshTokenAdapter,
  MongooseUserAdapter,
  RefreshTokenSchemaDefinition,
  UserSchemaDefinition
} from '@infra/mongoose'
import { AccessTokenGuard, AuthController } from '@interface/http'

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      { name: 'User', schema: UserSchemaDefinition },
      { name: 'RefreshToken', schema: RefreshTokenSchemaDefinition }
    ]),

    JwtModule.registerAsync({
      useFactory: () => ({
        secret: requireStringEnv(DbConfigFlag.JwtSecret),
        signOptions: {
          expiresIn: requireStringEnv(DbConfigFlag.JwtExpiresIn) as never
        }
      })
    })
  ],

  controllers: [AuthController],

  providers: [
    SignupUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    MeUseCase,
    AccessTokenGuard,

    {
      provide: UserPort,
      useClass: MongooseUserAdapter
    },
    {
      provide: RefreshTokenPort,
      useClass: MongooseRefreshTokenAdapter
    }
  ],

  exports: [JwtModule]
})
export class AuthModule {}
