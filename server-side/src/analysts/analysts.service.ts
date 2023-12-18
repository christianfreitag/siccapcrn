import { Injectable } from '@nestjs/common';
import { Analyst } from '@prisma/client';
import { contains } from 'class-validator';
import { userInfo } from 'os';
import { parse } from 'path';
import { PrismaService } from 'src/database/services/prisma.service';
import { handlePrismaExceptionCode } from 'src/exceptions/handlePrismaExceptionCode';
import { CreateAnalystsDto } from './dto/create-analysts.dto';
import { UpdateAnalystsDto } from './dto/update-analysts.dto';

@Injectable()
export class AnalystsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createAnalystsDto: CreateAnalystsDto,
  ): Promise<{ statusCode: number; data?: Partial<Analyst>; detail?: {} }> {
    const data = createAnalystsDto;
    data.status = 0;
    try {
      const analyst = await this.prisma.analyst.create({ data });
      return { statusCode: 200, data: analyst };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findAll(
    query,
    user,
  ): Promise<{
    statusCode: number;
    data?: Partial<[Analyst[], number]>;
    detail?: {};
  }> {
    try {
      const nPerPage = 8;

      const analysts = await this.prisma.$transaction([
        this.prisma.analyst.findMany({
          take: 8,
          skip: nPerPage * (parseInt(query.page) - 1),
          where: {
            created_by: user.sub,
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},

            AND: [
              query.searchData != ''
                ? {
                    name: {
                      contains: query.searchData,
                      mode: 'insensitive',
                    },
                  }
                : {},
              parseInt(query.status) != 9
                ? parseInt(query.status) != 0
                  ? {
                      AND: [
                        parseInt(query.status) == 1
                          ? { OR: [{ status: 1 }, { status: 3 }] }
                          : { OR: [{ status: 2 }, { status: 3 }] },
                      ],
                    }
                  : { status: 0 }
                : {},
            ],
          },

          include: { Report: { where: { status: 1 } } },
        }),
        this.prisma.analyst.count({
          take: 8,
          skip: nPerPage * (parseInt(query.page) - 1),
          where: {
            created_by: user.sub,
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},

            AND: [
              query.searchData != ''
                ? {
                    name: {
                      contains: query.searchData,
                      mode: 'insensitive',
                    },
                  }
                : {},
              parseInt(query.status) != 9
                ? parseInt(query.status) != 0
                  ? {
                      AND: [
                        parseInt(query.status) == 1
                          ? { OR: [{ status: 1 }, { status: 3 }] }
                          : { OR: [{ status: 2 }, { status: 3 }] },
                      ],
                    }
                  : { status: 0 }
                : {},
            ],
          },
        }),
      ]);

      return { statusCode: 200, data: analysts };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async count(
    query,
    user,
  ): Promise<{ statusCode: number; data?: number[]; detail?: {} }> {
    try {
      var countStatus = <number[]>[0, 0, 0];
      const countAnalystStatus = await this.prisma.analyst.groupBy({
        by: ['status'],
        where: {
          created_by: user.sub,
          create_at:
            query.dateFrom && query.dateTo
              ? { gte: query.dateFrom, lte: query.dateTo }
              : {},
        },
        _count: true,
      });

      countAnalystStatus.forEach((e) => {
        if (e.status == 3) {
          countStatus[1] += e._count;
          countStatus[2] += e._count;
        } else {
          countStatus[e.status] += e._count;
        }
      });

      return { statusCode: 200, data: countStatus };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findOne(
    id: string,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Analyst>; detail?: {} }> {
    try {
      const analyst = await this.prisma.analyst.findUnique({
        where: {
          id: id,
        },

        include: {
          Report: true,
          vacation: true,
          user: { select: { name: true } },
        },
      });
      if (analyst && analyst.created_by == user.sub) {
        return { statusCode: 200, data: analyst };
      } else {
        return { statusCode: 404, detail: 'Nenhum analista encontrado.' };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async update(
    id: string,
    updateAnalystsDto: UpdateAnalystsDto,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Analyst>; detail?: {} }> {
    const data = updateAnalystsDto;
    try {
      const analyst_checkuser = await this.prisma.analyst.findFirst({
        where: { id, created_by: user.sub },
      });

      const analystWithSameCpf = await this.prisma.analyst.findFirst({
        where: { cpf: data.cpf, id: { not: id } },
      });

      if (!analystWithSameCpf) {
        if (analyst_checkuser) {
          const analyst = await this.prisma.analyst.update({
            where: { id },
            data,
          });
          return { statusCode: 200, data: analyst };
        } else {
          return { statusCode: 404 };
        }
      } else {
        return { statusCode: 409 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async remove(
    id,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Analyst>; detail?: {} }> {
    try {
      const analyst_checkuser = await this.prisma.analyst.findFirst({
        where: { id, created_by: user.sub },
      });

      if (analyst_checkuser) {
        const analyst = await this.prisma.analyst.delete({
          where: { id: id },
        });
        return { statusCode: 200, data: analyst };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }
}
