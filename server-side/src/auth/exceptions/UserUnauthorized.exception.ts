import { HttpException, HttpStatus } from '@nestjs/common';

export class UserUnauthorizedException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      'Não foi possível encontrar um login com as credenciais informadas.',
      status || HttpStatus.UNAUTHORIZED,
    );
  }
}
