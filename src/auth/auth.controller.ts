import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from "express";
import { AuthService } from './auth.service';
import { Public } from '../shared/decorators/public.decorator';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() authDto: AuthDto) {
    const logged = await this.authService.login(authDto);
    return logged;
  }

  @Post('validate')
  @HttpCode(200)
  async validateUserLogged(@Req() request: Request) {
    return request.user;
  }
}
