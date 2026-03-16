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
import { requireStringEnvCompute } from '@repo/environment'
import { natsConnectionProvider, NatsLifecycleService } from '@repo/event-bus'

import { DbConfigFlag } from '@infra/db'
import {
  MongooseSessionAdapter,
  MongooseUserAdapter,
  SessionSchemaDefinition,
  UserSchemaDefinition
} from '@infra/mongoose'
import { AccessTokenGuard, AuthorityController } from '@interface/http'
import { AuthorityTokenService } from '@application/services/authority-token.service'
import { authorityEventBusProvider } from '@infra/event-bus'
import { GoogleOAuthAdapter } from '@infra/oauth'
import { SessionCircuitBreakerAdapter } from '@infra/session'
import { UserProfileCreatedConsumer } from '@interface/consumers/user-profile-created.consumer'

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      { name: 'User', schema: UserSchemaDefinition },
      { name: 'Session', schema: SessionSchemaDefinition }
    ]),

    JwtModule.registerAsync({
      useFactory: () => ({
  secret: requireStringEnvCompute(DbConfigFlag.JwtSecret),
        signOptions: {
        expiresIn: requireStringEnvCompute(DbConfigFlag.JwtExpiresIn) as never
        }
      })
    })
  ],

  controllers: [AuthorityController],

  providers: [
    SignupUseCase,
    LoginUseCase,
    GoogleSignupUseCase,
    GoogleLoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    MeUseCase,
    AccessTokenGuard,
    UserProfileCreatedConsumer,
    AuthorityTokenService,
    natsConnectionProvider,
    authorityEventBusProvider,
    NatsLifecycleService,

    {
      provide: UserPort,
      useClass: MongooseUserAdapter
    },
    MongooseSessionAdapter,
    {
      provide: SessionPort,
      useFactory: (delegate: MongooseSessionAdapter) =>
        new SessionCircuitBreakerAdapter(delegate),
      inject: [MongooseSessionAdapter]
    },
    {
      provide: GoogleOAuthPort,
      useClass: GoogleOAuthAdapter
    }
  ],

  exports: [JwtModule]
})
export class AuthorityModule {}
