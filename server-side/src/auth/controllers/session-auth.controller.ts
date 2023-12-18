import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { ServerFailedException } from 'src/exceptions/ServerFailed.exception';
import { ServiceUnavailableException } from 'src/exceptions/ServiceUnavailable.exception';
import { Public } from '../decorators';
import { UserUnauthorizedException } from '../exceptions/UserUnauthorized.exception';

@Controller('auth')
export class SessionController {
  constructor(private authService: AuthService) {}
  private errorCodeHandler(code: number) {
    switch (code) {
      case 401:
        throw new UserUnauthorizedException();
      case 500:
        throw new ServerFailedException();
      case 404:
        throw new UserUnauthorizedException();
      default:
        throw new ServiceUnavailableException();
    }
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    if (user.statusCode == 200) {
      const gJwtRes = await this.authService.gJWT(user);
      try {
        res.cookie('authoken', gJwtRes.access_token, {
          httpOnly: true,
          secure: true,
          expires: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), //Hora * 60 * 60 * 1000
        });
      } catch (e) {}
      return gJwtRes;
    } else {
      this.errorCodeHandler(user.statusCode);
    }
  }

  @Get('logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    res.cookie('authoken', 'none', {
      httpOnly: true,
      secure: true,
      expires: new Date(new Date().getTime() + 5 * 1000), //Hora * 60 * 60 * 1000
    });
  }

  @Get()
  checkToken(@Request() req) {
    return { data: req.user.data, status: 200 };
  }
}
