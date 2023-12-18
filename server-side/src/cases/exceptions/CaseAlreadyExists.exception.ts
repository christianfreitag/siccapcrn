import { HttpException, HttpStatus } from '@nestjs/common';

export class CaseAlreadyExistsException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Este caso já está registrado no sistema.',
      status || HttpStatus.CONFLICT,
    );
  }
}
