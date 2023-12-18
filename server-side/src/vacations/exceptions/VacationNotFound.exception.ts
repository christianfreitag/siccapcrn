import { HttpException, HttpStatus } from '@nestjs/common';

export class VacationNotFoundExceptions extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Não foi encontrado nenhum afastamento com essas informações.',
      status || HttpStatus.NOT_FOUND,
    );
  }
}
