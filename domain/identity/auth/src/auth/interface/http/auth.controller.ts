import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import type { Request } from 'express'

import {
  GoogleLoginUseCase,
  GoogleSignupUseCase,
  LoginUseCase,
  LogoutUseCase,
  MeUseCase,
  RefreshTokenUseCase,
  SignupUseCase
} from '@application/use-cases'
import type {
  AuthResponseDto,
  GoogleAuthRequestDto,
  LoginRequestDto,
  MeResponseDto,
  RefreshTokenRequestDto,
  SignupRequestDto
} from '@interface/dto'
import {
  AccessTokenGuard,
  GoogleAuthBodyPipe,
  LoginBodyPipe,
  RefreshTokenBodyPipe,
  SignupBodyPipe
} from '@interface/http'
import { getRequestContext } from '@interface/http/request-metadata'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signup: SignupUseCase,
    private readonly login: LoginUseCase,
    private readonly refreshToken: RefreshTokenUseCase,
    private readonly logout: LogoutUseCase,
    private readonly me: MeUseCase,
    private readonly googleSignup: GoogleSignupUseCase,
    private readonly googleLogin: GoogleLoginUseCase
  ) {}

  @Post('signup')
  async signupHandler(
    @Req() request: Request,
    @Body(SignupBodyPipe) body: SignupRequestDto
  ): Promise<AuthResponseDto> {
    return this.signup.execute(body, getRequestContext(request))
  }

  @Post('login')
  @HttpCode(200)
  async loginHandler(
    @Req() request: Request,
    @Body(LoginBodyPipe) body: LoginRequestDto
  ): Promise<AuthResponseDto> {
    return this.login.execute(body.email, body.password, getRequestContext(request))
  }

  @Post('google/signup')
  @HttpCode(200)
  async googleSignupHandler(
    @Req() request: Request,
    @Body(GoogleAuthBodyPipe) body: GoogleAuthRequestDto
  ): Promise<AuthResponseDto> {
    return this.googleSignup.execute(body.idToken, getRequestContext(request))
  }

  @Post('google/login')
  @HttpCode(200)
  async googleLoginHandler(
    @Req() request: Request,
    @Body(GoogleAuthBodyPipe) body: GoogleAuthRequestDto
  ): Promise<AuthResponseDto> {
    return this.googleLogin.execute(body.idToken, getRequestContext(request))
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshTokenHandler(
    @Body(RefreshTokenBodyPipe) body: RefreshTokenRequestDto
  ): Promise<AuthResponseDto> {
    return this.refreshToken.execute(body.refreshToken)
  }

  @Post('logout')
  @HttpCode(200)
  async logoutHandler(
    @Body(RefreshTokenBodyPipe) body: RefreshTokenRequestDto
  ): Promise<{ success: boolean }> {
    return this.logout.execute(body.refreshToken)
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async meHandler(@Req() request: { user: { sub: string } }): Promise<MeResponseDto> {
    return this.me.execute(request.user.sub)
  }
}
