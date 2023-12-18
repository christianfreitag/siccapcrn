import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceUnavailableException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(
      msg || 'Serviço indisponível',
      status || HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
