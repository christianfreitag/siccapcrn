import { HttpException, HttpStatus } from '@nestjs/common';

export class VacationAlreadyExistsExceptions extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Ja existe um afastamento agendado no periodo selecionado.',
      status || HttpStatus.CONFLICT,
    );
  }
}
