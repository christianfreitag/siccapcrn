import { HttpException, HttpStatus } from '@nestjs/common';

export class CaseNotFoundException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'O caso solicitado não foi encontrado.',
      status || HttpStatus.NOT_FOUND,
    );
  }
}
