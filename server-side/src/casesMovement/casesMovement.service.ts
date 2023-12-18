import { Injectable } from '@nestjs/common';
import { Case, CaseMovement, prisma } from '@prisma/client';
import { PrismaService } from 'src/database/services/prisma.service';
import { handlePrismaExceptionCode } from 'src/exceptions/handlePrismaExceptionCode';
import { CreateCaseMovementDto } from './dto/create-caseMovement.dto';

@Injectable()
export class CasesMovementService {
  constructor(private prisma: PrismaService) {}

  async create(createCaseMovimentDto: CreateCaseMovementDto): Promise<{
    statusCode: number;
    data?: Partial<CaseMovement>;
    detail?: {};
  }> {
    const data = createCaseMovimentDto;
    try {
      const caseMovement = await this.prisma.caseMovement.create({ data });
      const case_ = await this.prisma.case.update({
        data: { expiredDate: data.expire_date },
        where: { id: data.case_id },
      });

      return { statusCode: 200, data: caseMovement };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findAll(
    user,
    id: string,
  ): Promise<{
    statusCode: number;
    data?: Partial<CaseMovement>[];
    detail?: {};
  }> {
    const date = new Date();
    date.setHours(20, 0, 0, 0);

    try {
      const caseMovement = await this.prisma.caseMovement.findMany({
        where: {
          created_by: user.sub,
          case_id: id,
        },
        orderBy: {
          date: 'asc',
        },
      });

      return { statusCode: 200, data: caseMovement };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async remove(
    id: string,
    user,
  ): Promise<{
    statusCode: number;
    data?: Partial<CaseMovement>;
    detail?: {};
  }> {
    try {
      const caseMovement_checkuser = await this.prisma.caseMovement.findFirst({
        where: { id, created_by: user.sub },
      });
      if (caseMovement_checkuser) {
        const caseMovement = await this.prisma.caseMovement.delete({
          where: {
            id: id,
          },
        });

        return { statusCode: 200, data: caseMovement };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }
}
