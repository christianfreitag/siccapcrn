import { HttpException, HttpStatus } from '@nestjs/common';

export class ServerFailedException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Falha de comunicação com servidor.',
      status || HttpStatus.BAD_REQUEST,
    );
  }
}
