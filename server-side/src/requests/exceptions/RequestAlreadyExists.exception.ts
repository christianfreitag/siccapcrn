import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestAlreadyExistsException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Ja existe uma solicitação com esses dados registrado no sistema.',
      status || HttpStatus.CONFLICT,
    );
  }
}
