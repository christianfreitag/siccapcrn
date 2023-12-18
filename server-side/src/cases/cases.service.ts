import { Injectable } from '@nestjs/common';
import { Case, prisma } from '@prisma/client';
import { PrismaService } from 'src/database/services/prisma.service';
import { handlePrismaExceptionCode } from 'src/exceptions/handlePrismaExceptionCode';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCaseDto: CreateCaseDto,
  ): Promise<{ statusCode: number; data?: Partial<Case>; detail?: {} }> {
    const data = createCaseDto;
    try {
      const case_ = await this.prisma.case.create({ data });

      return { statusCode: 200, data: case_ };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findAll(
    query,
    user,
  ): Promise<{
    statusCode: number;
    data?: [Partial<Case>[], number];
    detail?: {};
  }> {
    const nPerPage = 8;
    const date = new Date();
    date.setHours(20, 0, 0, 0);

    const caseSearchFilter = {
      num_caso_lab: {
        num_caso_lab: {
          contains: query.searchData,
          mode: 'insensitive',
        },
      },
      numSei: {
        num_sei: {
          contains: query.searchData,
          mode: 'insensitive',
        },
      },
      operationName: {
        operation_name: {
          contains: query.searchData,
          mode: 'insensitive',
        },
      },
      ipNumber: {
        ip_number: {
          contains: query.searchData,
          mode: 'insensitive',
        },
      },
      demandantUnit: {
        demandant_unit: {
          contains: query.searchData,
          mode: 'insensitive',
        },
      },
    };

    const filterSearchData =
      query.searchData != ('' || undefined || null)
        ? query.searchBy != 'all'
          ? [caseSearchFilter[query.searchBy]]
          : Object.entries(caseSearchFilter).map(([t, v], index) => {
              return v;
            })
        : [];

    try {
      const cases_ = await this.prisma.$transaction([
        this.prisma.case.findMany({
          skip: (parseInt(query.page) - 1) * nPerPage,
          take: nPerPage,
          where: {
            created_by: user.sub,
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},
            AND:
              query.status != 0
                ? [
                    {
                      end_date: query.status == 4 ? { not: null } : null,
                      expiredDate:
                        query.status == 1
                          ? null
                          : {
                              gt: query.status == 2 ? date : undefined,
                              lte: query.status == 3 ? date : undefined,
                            },
                    },
                  ]
                : [],
            OR: filterSearchData,
          },
          orderBy: {
            create_at: query.order,
          },
          select: {
            id: true,
            num_caso_lab: true,
            create_at: true,
            num_sei: true,
            step_dates: true,
            operation_name: true,
            CaseMovement: true,
          },
        }),
        this.prisma.case.count({
          where: {
            created_by: user.sub,
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},

            AND:
              query.status != 0
                ? [
                    {
                      end_date: query.status == 4 ? { not: null } : null,
                      step_dates: {
                        isEmpty: query.status == 1 ? true : false,
                      },
                      expiredDate: {
                        gte: query.status == 2 ? date : undefined,
                        lte: query.status == 3 ? date : undefined,
                      },
                    },
                  ]
                : undefined,
            OR: filterSearchData,
          },
        }),
      ]);

      return { statusCode: 200, data: cases_ };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async count(
    query,
    user,
  ): Promise<{
    statusCode: number;
    data?: number[];
    detail?: {};
  }> {
    try {
      const date = new Date();
      date.setHours(20, 0, 0, 0);
      const countCase = await this.prisma.$transaction([
        this.prisma.case.count({
          where: {
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},
            created_by: user.sub,
            end_date: null,
            expiredDate: null,
          },
        }),
        this.prisma.case.count({
          where: {
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},
            created_by: user.sub,
            end_date: null,
            expiredDate: {
              gte: date,
            },
          },
        }),
        this.prisma.case.count({
          where: {
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},
            created_by: user.sub,
            end_date: null,
            expiredDate: {
              lte: date,
            },
          },
        }),
        this.prisma.case.count({
          where: {
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},
            created_by: user.sub,
            end_date: {
              not: null,
            },
          },
        }),
      ]);

      return {
        statusCode: 200,
        data: countCase,
      };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findOne(
    id: string,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Case>; detail?: {} }> {
    try {
      const case_ = await this.prisma.case.findUnique({
        where: {
          id: id,
        },
        include: { Report: true, Requests: true },
      });
      if (case_ && (case_.created_by == user.sub || user.ulevel == 2)) {
        return { statusCode: 200, data: case_ };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async update(
    id: string,
    updateCaseDto: UpdateCaseDto,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Case>; detail?: {} }> {
    const data = updateCaseDto;

    //UPDATE step
    try {
      const case_checkUser = await this.prisma.case.findFirst({
        where: { id, created_by: user.sub },
      });

      if (case_checkUser) {
        const case_ = await this.prisma.case.update({
          where: {
            id: id,
          },
          data,
        });
        return { statusCode: 200, data: case_ };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async remove(
    id: string,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Case>; detail?: {} }> {
    try {
      const case_checkuser = await this.prisma.case.findFirst({
        where: { id, created_by: user.sub },
      });
      if (case_checkuser || user.ulevel == 2) {
        const case_ = await this.prisma.case.delete({
          where: {
            id: id,
          },
        });

        return { statusCode: 200, data: case_ };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }
}
