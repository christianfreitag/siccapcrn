import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

//Caso seja necessario vou adicionando mais codigos referentes a erros de REST com Prisma
export function handlePrismaExceptionCode(codeError: string): number {
  switch (codeError) {
    case 'P2025':
      return 404;
    case 'P2002':
      return 409;
    case 'P2003':
      return 4001;
    default:
      return 500;
  }
}
