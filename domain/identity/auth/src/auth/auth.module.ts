import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import {
  GoogleLoginUseCase,
  GoogleSignupUseCase,
  LoginUseCase,
  LogoutUseCase,
  MeUseCase,
  RefreshTokenUseCase,
  SignupUseCase
} from '@application/use-cases'
import { GoogleOAuthPort, SessionPort, UserPort } from '@domain/ports'
import { requireStringEnv } from '@infra/env'
import { DbConfigFlag } from '@infra/db'
import {
  MongooseSessionAdapter,
  MongooseUserAdapter,
  SessionSchemaDefinition,
  UserSchemaDefinition
} from '@infra/mongoose'
import { AccessTokenGuard, AuthController } from '@interface/http'
import { AuthTokenService } from '@application/services/auth-token.service'
import {
  authEventBusProvider,
  natsConnectionProvider,
  NatsLifecycleService
} from '@infra/event-bus'
import { GoogleOAuthAdapter } from '@infra/oauth'

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      { name: 'User', schema: UserSchemaDefinition },
      { name: 'Session', schema: SessionSchemaDefinition }
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
    GoogleSignupUseCase,
    GoogleLoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    MeUseCase,
    AccessTokenGuard,
    AuthTokenService,
    natsConnectionProvider,
    authEventBusProvider,
    NatsLifecycleService,

    {
      provide: UserPort,
      useClass: MongooseUserAdapter
    },
    {
      provide: SessionPort,
      useClass: MongooseSessionAdapter
    },
    {
      provide: GoogleOAuthPort,
      useClass: GoogleOAuthAdapter
    }
  ],

  exports: [JwtModule]
})
export class AuthModule {}
