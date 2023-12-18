import { HttpException, HttpStatus } from '@nestjs/common';

export class InvestigatedNotFoundException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'O investigado não pode ser encontrado',
      status || HttpStatus.NOT_FOUND,
    );
  }
}
