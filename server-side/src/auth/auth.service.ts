import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';
import { validatePassword } from 'src/utils/bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtServices: JwtService,
  ) {}

  async validateUser(
    cpf: string,
    pass: string,
  ): Promise<{ statusCode: number; data?: Partial<User>; detail?: {} }> {
    const user = await this.usersService.findOne(cpf, 'cpf');

    if (user.statusCode == 200) {
      const isValidated = await validatePassword(user.data.password, pass);
      if (user && isValidated) {
        return {
          statusCode: 200,
          data: {
            name: user.data.name,
            cpf: user.data.cpf,
            email: user.data.email,
            id: user.data.id,
            user_level: user.data.user_level,
          },
        };
      } else {
        return { statusCode: 401 };
      }
    } else {
      return user;
    }
  }

  async gJWT(user: { statusCode: number; data?: Partial<User>; detail?: {} }) {
    //Gera o token de sessão
    const payload = {
      username: user.data.cpf,
      sub: user.data.id,
      name: user.data.name,
      ulevel: user.data.user_level,
    };
    return {
      access_token: this.jwtServices.sign(payload),
    };
  }
}
