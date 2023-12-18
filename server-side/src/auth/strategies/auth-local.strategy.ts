import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    cpf: string,
    password: string,
  ): Promise<{ statusCode: number; data?: Partial<User>; detail?: {} }> {
    const user = await this.authService.validateUser(cpf, password);
    return user;
  }
}
