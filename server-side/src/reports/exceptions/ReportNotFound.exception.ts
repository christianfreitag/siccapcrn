import { HttpException, HttpStatus } from '@nestjs/common';

export class ReportNotFoundException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'O relatório não pode ser encontrado.',
      status || HttpStatus.NOT_FOUND,
    );
  }
}
