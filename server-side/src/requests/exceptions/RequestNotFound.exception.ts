import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestNotFoundException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'A solicitação não foi encontrado.',
      status || HttpStatus.NOT_FOUND,
    );
  }
}
