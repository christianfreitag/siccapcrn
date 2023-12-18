import { HttpException, HttpStatus } from '@nestjs/common';

export class ReportAlreadyExistsException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Este relatório ja existe no sistema.',
      status || HttpStatus.CONFLICT,
    );
  }
}
