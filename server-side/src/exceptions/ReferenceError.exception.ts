import { HttpException, HttpStatus } from '@nestjs/common';

export class ReferenceErrorException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Ocorreu um erro de referênciamento.',
      status || HttpStatus.BAD_REQUEST,
    );
  }
}
