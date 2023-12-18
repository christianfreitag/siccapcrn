import { HttpException, HttpStatus } from '@nestjs/common';

export class InvestigatedAlreadyExistsException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg ||
        'Ja existe um investigado com esses dados registrados nessa solicitação ou no sistema.',
      status || HttpStatus.CONFLICT,
    );
  }
}
