import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Usuário não pode ser encontrado.',
      status || HttpStatus.BAD_REQUEST,
    );
  }
}
