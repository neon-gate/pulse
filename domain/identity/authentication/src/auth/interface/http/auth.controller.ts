import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'

import {
  LoginUseCase,
  LogoutUseCase,
  MeUseCase,
  RefreshTokenUseCase,
  SignupUseCase
} from '@application/use-cases'
import type {
  AuthResponseDto,
  LoginRequestDto,
  MeResponseDto,
  RefreshTokenRequestDto,
  SignupRequestDto
} from '@interface/dto'
import {
  AccessTokenGuard,
  LoginBodyPipe,
  RefreshTokenBodyPipe,
  SignupBodyPipe
} from '@interface/http'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signup: SignupUseCase,
    private readonly login: LoginUseCase,
    private readonly refreshToken: RefreshTokenUseCase,
    private readonly logout: LogoutUseCase,
    private readonly me: MeUseCase
  ) {}

  @Post('signup')
  async signupHandler(@Body(SignupBodyPipe) body: SignupRequestDto) {
    return this.signup.execute(body)
  }

  @Post('login')
  @HttpCode(200)
  async loginHandler(
    @Body(LoginBodyPipe) body: LoginRequestDto
  ): Promise<AuthResponseDto> {
    return this.login.execute(body.email, body.password)
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshTokenHandler(
    @Body(RefreshTokenBodyPipe) body: RefreshTokenRequestDto
  ): Promise<{ accessToken: string }> {
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
  async meHandler(
    @Req() request: { user: { sub: string } }
  ): Promise<MeResponseDto> {
    return this.me.execute(request.user.sub)
  }
}
