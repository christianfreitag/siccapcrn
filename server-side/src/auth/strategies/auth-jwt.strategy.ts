import { PassportStrategy } from '@nestjs/passport';
import { Request, request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConst } from '../auth-constants';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let data = request?.cookies['authoken'];

          if (!data) {
            return null;
          } else {
            return data;
          }
        },
      ]),
      /*jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),*/
      ignoreExpiration: false,

      secretOrKey: jwtConst.s3cret,
    });
  }

  async validate(payload: any) {
    return { data: payload };
  }
}
