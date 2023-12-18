import { HttpException, HttpStatus } from '@nestjs/common';

export class CaseMovementAlreadyExistsException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Esta movimentação ja existe no sistema',
      status || HttpStatus.CONFLICT,
    );
  }
}
