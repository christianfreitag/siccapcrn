import { HttpException, HttpStatus } from '@nestjs/common';

export class CaseMovementNotFoundException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Esta movimentação não foi encontrada',
      status || HttpStatus.NOT_FOUND,
    );
  }
}
