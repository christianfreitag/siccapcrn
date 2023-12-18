import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConst } from './auth-constants';
import { SessionController } from 'src/auth/controllers/session-auth.controller';
import { JwtStrategy } from './strategies/auth-jwt.strategy';
import { LocalStrategy } from './strategies/auth-local.strategy';

@Module({
  controllers: [SessionController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConst.s3cret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
