import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsExceptions extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Já existe um usuário cadastrado com essa informação.',
      status || HttpStatus.CONFLICT,
    );
  }
}
