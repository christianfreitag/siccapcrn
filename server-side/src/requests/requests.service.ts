import { Injectable } from '@nestjs/common';
import { Requests } from '@prisma/client';
import { query } from 'express';
import { userInfo } from 'os';
import { PrismaService } from 'src/database/services/prisma.service';
import { handlePrismaExceptionCode } from 'src/exceptions/handlePrismaExceptionCode';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createRequestDto: CreateRequestDto,
  ): Promise<{ statusCode: number; data?: Partial<Requests>; detail?: {} }> {
    const data = createRequestDto;
    try {
      const request_ = await this.prisma.requests.create({
        data,
      });

      return { statusCode: 200, data: request_ };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findAll(
    q,
    user,
  ): Promise<{
    statusCode: number;
    data?: [Partial<Requests>[], number] | number;
    detail?: {};
  }> {
    try {
      const nPerPage = 8;
      const requests_ =
        q.countOnly == 'true'
          ? await this.prisma.requests.count({
              where: {
                created_by: user.sub,
                create_at:
                  q.dateFrom && q.dateTo
                    ? { gte: q.dateFrom, lte: q.dateTo }
                    : {},
              },
            })
          : await this.prisma.$transaction([
              this.prisma.requests.findMany({
                take: nPerPage,
                skip: nPerPage * (parseInt(q.page) - 1),
                where: {
                  AND: [
                    {
                      created_by: user.sub,
                      create_at:
                        q.dateFrom && q.dateTo
                          ? { gte: q.dateFrom, lte: q.dateTo }
                          : {},
                    },
                    q.searchData != '' && q.searchData != undefined
                      ? {
                          OR: [
                            q.searchByNum == 'true'
                              ? { num_request: { contains: q.searchData } }
                              : {},
                            q.searchByInvestigated == 'true'
                              ? {
                                  Investigated_requests: {
                                    some: {
                                      investigated: {
                                        name: {
                                          contains: q.searchData,
                                          mode: 'insensitive',
                                        },
                                      },
                                    },
                                  },
                                }
                              : null,
                          ],
                        }
                      : {},
                  ],
                },

                select: {
                  num_request: true,
                  caso: true,
                  id: true,
                  _count: { select: { Investigated_requests: true } },
                  Investigated_requests:
                    q.searchByInvestigated && q.searchData
                      ? {
                          where: {
                            investigated: {
                              name: {
                                contains: q.searchData,
                                mode: 'insensitive',
                              },
                            },
                          },
                          select: { investigated: { select: { name: true } } },
                        }
                      : {
                          select: { investigated: { select: { name: true } } },
                        },
                },
              }),
              this.prisma.requests.count({
                take: nPerPage,
                skip: nPerPage * (parseInt(q.page) - 1),
                where: {
                  AND: [
                    {
                      created_by: user.sub,
                      create_at:
                        q.dateFrom && q.dateTo
                          ? { gte: q.dateFrom, lte: q.dateTo }
                          : {},
                    },
                    q.searchData != '' && q.searchData != undefined
                      ? {
                          OR: [
                            q.searchByNum == 'true'
                              ? { num_request: { contains: q.search_data } }
                              : {},
                            q.searchByInvestigated == 'true'
                              ? {
                                  Investigated_requests: {
                                    some: {
                                      investigated: {
                                        name: {
                                          contains: q.searchData,
                                          mode: 'insensitive',
                                        },
                                      },
                                    },
                                  },
                                }
                              : null,
                          ],
                        }
                      : {},
                  ],
                },
              }),
            ]);

      return { statusCode: 200, data: requests_ };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findOne(
    id: string,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Requests>; detail?: {} }> {
    try {
      const request_ = await this.prisma.requests.findUnique({
        where: { id },
        include: {
          Investigated_requests: { include: { investigated: true } },
          user: { select: { name: true } },
        },
      });

      if (request_ && (request_.created_by == user.sub || user.ulevel == 2)) {
        return { statusCode: 200, data: request_ };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async update(
    id: string,
    updateRequestDto: UpdateRequestDto,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Requests>; detail?: {} }> {
    const data = updateRequestDto;
    try {
      const request_checkUser = await this.prisma.requests.findFirst({
        where: { id, created_by: user.sub },
      });
      if (request_checkUser) {
        const request_ = await this.prisma.requests.update({
          where: { id },
          data,
        });

        return { statusCode: 200, data: request_ };
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
  ): Promise<{ statusCode: number; data?: Partial<Requests>; detail?: {} }> {
    try {
      const request_checkUser = await this.prisma.requests.findFirst({
        where: { id, created_by: user.sub },
      });

      if (request_checkUser) {
        const request_ = await this.prisma.requests.delete({
          where: { id },
        }); //Deletando a solicitação atual
        return { statusCode: 200, data: request_ };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }
}
