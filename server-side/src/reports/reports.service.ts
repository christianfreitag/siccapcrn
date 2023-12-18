import { Injectable } from '@nestjs/common';
import { Report } from '@prisma/client';
import { isEmpty } from 'class-validator';
import { parse } from 'path';

import { PrismaService } from 'src/database/services/prisma.service';
import { handlePrismaExceptionCode } from 'src/exceptions/handlePrismaExceptionCode';
import { CreateReportsDto } from './dto/reports-create.dto';
import { UpdateReportsDto } from './dto/reports-update.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReportsDto: CreateReportsDto,
  ): Promise<{ statusCode: number; data?: Partial<Report>; detail?: string }> {
    const data = createReportsDto;
    try {
      const report_ = await this.prisma.report.create({ data });

      return { statusCode: 200, data: report_ };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code) };
    }
  }

  async findAll(
    query,
    user,
  ): Promise<{
    statusCode: number;
    data?: [Partial<Report>[], number];
    detail?: string;
  }> {
    const orderBy = {
      analyst: { analyst: { name: 'asc' } },
    };
    try {
      const nPerPage = 8;
      const reports_ = await this.prisma.$transaction([
        this.prisma.report.findMany({
          skip: nPerPage * (parseInt(query.page) - 1),
          take: nPerPage,
          where: {
            AND: [
              query.analystFilter != undefined
                ? {
                    analyst_id: query.analystFilter,
                  }
                : {},
              query.typeFilter != undefined
                ? {
                    type: parseInt(query.typeFilter),
                  }
                : {},
              query.analystId != undefined || query.analystId != null
                ? {
                    analyst_id: query.analystId,
                  }
                : null,
              query.searchData != (null || undefined || '')
                ? { num_report: { contains: query.searchData } }
                : null,
              {
                create_at:
                  query.dateFrom && query.dateTo
                    ? { gte: query.dateFrom, lte: query.dateTo }
                    : {},
              },
              query.status != 0
                ? { status: query.status == 1 ? 0 : parseInt(query.status) - 1 }
                : undefined,
              query.case_id
                ? { case_id: query.case_id, created_by: user.sub }
                : { created_by: user.sub },
            ],
          },
          select: {
            id: true,
            num_report: true,
            type: true,
            analyst: { select: { id: true, name: true } },
            step_dates: true,
            status: true,
            file: true,
          },
        }),
        this.prisma.report.count({
          where: {
            AND: [
              query.analystFilter != undefined
                ? {
                    analyst_id: query.analystFilter,
                  }
                : {},
              query.typeFilter != undefined
                ? {
                    type: parseInt(query.typeFilter),
                  }
                : {},
              query.analystId != undefined || query.analystId != null
                ? {
                    analyst_id: query.analystId,
                  }
                : null,
              query.searchData != (null || undefined || '')
                ? { num_report: { contains: query.searchData } }
                : null,
              {
                create_at:
                  query.dateFrom && query.dateTo
                    ? { gte: query.dateFrom, lte: query.dateTo }
                    : {},
              },
              query.status != 0
                ? { status: query.status == 1 ? 0 : parseInt(query.status) - 1 }
                : undefined,
              query.case_id
                ? { case_id: query.case_id, created_by: user.sub }
                : { created_by: user.sub },
            ],
          },
        }),
      ]);
      return { statusCode: 200, data: reports_ };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code) };
    }
  }

  async count(
    query,
    user,
  ): Promise<{
    statusCode: number;
    data?: number[];
    detail?: string;
  }> {
    try {
      var countReports = [0, 0, 0];
      await this.prisma.report
        .groupBy({
          by: ['status'],
          where: {
            created_by: user.sub,
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},
          },
          _count: true,
        })
        .then((res) => {
          res.forEach((e, index) => {
            countReports[e.status] = e._count;
          });
        });

      return { statusCode: 200, data: countReports };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code) };
    }
  }

  async findOne(
    id: string,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Report>; detail?: string }> {
    try {
      const report_ = await this.prisma.report.findUnique({
        where: { id: id },
        select: {
          analyst: { select: { id: true, name: true } },

          case_id: true,
          num_report: true,
          user: { select: { name: true } },
          create_at: true,
          created_by: true,
          type: true,
          step_dates: true,
          id: true,
          file: true,
          review_id: true,
        },
      });
      if (report_ && (report_.created_by == user.sub || user.ulevel == 2)) {
        return { statusCode: 200, data: report_ };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: 500 };
    }
  }

  async update(
    id: string,
    query,
    updateReportsDto: UpdateReportsDto,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Report>; detail?: string }> {
    const data = updateReportsDto;

    try {
      const report_checkUser = this.prisma.report.findFirst({
        where: { id, created_by: user.sub },
      });
      if (report_checkUser) {
        const oldReport = await this.prisma.report.findUnique({
          where: { id: id },
        });

        if (data.step_dates) {
          if (!data.analyst_id) {
            return {
              statusCode: 400.2,
              detail: 'O relatório ainda não tem um analista',
            };
          }

          data.status =
            data.step_dates.length > 0
              ? data.step_dates[data.step_dates.length - 1]['type'] + 1
              : 0;
          if (
            data.step_dates.length > 0 &&
            data.step_dates[data.step_dates.length - 1]['type'] == 0
          ) {
            const analyst = await this.prisma.analyst.findFirst({
              where: { created_by: user.sub, id: data.analyst_id },
            });
            if (analyst) {
              await this.prisma.analyst.update({
                where: { id: data.analyst_id },
                data: {
                  status: analyst.status == 1 ? 3 : 2,
                },
              });
            }
          } else {
            if (
              oldReport.step_dates.length > 0 &&
              oldReport.step_dates[oldReport.step_dates.length - 1]['type'] == 0
            ) {
              const analyst = await this.prisma.analyst.findFirst({
                where: { created_by: user.sub, id: oldReport.analyst_id },
              });
              if (analyst) {
                await this.prisma.analyst.update({
                  where: { id: data.analyst_id },
                  data: {
                    status: analyst.status == 3 ? 1 : 0,
                  },
                });
              }
            }
          }
        }
        if (data.step_dates == undefined) {
          if (data.analyst_id) {
            const analyst = await this.prisma.analyst.findFirst({
              where: { created_by: user.sub, id: data.analyst_id },
            });
            if (analyst) {
              await this.prisma.analyst.update({
                where: { id: data.analyst_id },
                data: {
                  status: oldReport.step_dates
                    ? oldReport.step_dates.length > 0
                      ? oldReport.step_dates[oldReport.step_dates.length - 1][
                          'type'
                        ] == 0
                        ? analyst.status == 0
                          ? 2
                          : 3
                        : analyst.status
                      : analyst.status
                    : analyst.status,
                },
              });
            } else {
              return { statusCode: 404 };
            }
          }
          if (oldReport.analyst_id) {
            const oldAnalyst = await this.prisma.analyst.findFirst({
              where: { created_by: user.sub, id: oldReport.analyst_id },
            });
            if (oldAnalyst) {
              const anotherReportsFromAnalyst = await this.prisma.report.count({
                where: { analyst_id: oldAnalyst.id, status: 1 },
              });
              if (
                anotherReportsFromAnalyst < 1 ||
                (anotherReportsFromAnalyst == 1 &&
                  oldReport.step_dates[oldReport.step_dates.length - 1][
                    'type'
                  ] == 0)
              ) {
                await this.prisma.analyst.update({
                  where: { id: oldAnalyst.id },
                  data: {
                    status:
                      oldReport.step_dates.length > 0
                        ? oldReport.step_dates[oldReport.step_dates.length - 1][
                            'type'
                          ] == 0
                          ? oldAnalyst.status == 2
                            ? 0
                            : 1
                          : oldAnalyst.status
                        : oldAnalyst.status,
                  },
                });
              }
            }
          }
        }

        const report_ = await this.prisma.report.update({
          where: { id },
          data,
          select: {
            analyst: { select: { id: true, name: true } },
            case_id: true,
            num_report: true,
            user: { select: { name: true } },
            create_at: true,
            created_by: true,
            type: true,
            step_dates: true,
            id: true,
            file: true,
            review_id: true,
          },
        });
        return { statusCode: 200, data: report_ };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code) };
    }
  }

  async remove(
    id: string,
    user,
  ): Promise<{ statusCode: number; data?: Partial<Report>; detail?: string }> {
    try {
      const report_checkUser = await this.prisma.report.findFirst({
        where: { id, created_by: user.sub },
      });
      if (report_checkUser) {
        if (report_checkUser.analyst_id) {
          const analyst = await this.prisma.analyst.findFirst({
            where: {
              created_by: user.sub,
              id: report_checkUser.analyst_id,
            },
          });

          const reportsFromAnalyst = await this.prisma.report.count({
            where: { analyst_id: report_checkUser.analyst_id, status: 1 },
          });

          await this.prisma.analyst.update({
            where: { id: report_checkUser.analyst_id },
            data: {
              status:
                analyst.status == 3 && reportsFromAnalyst <= 1
                  ? 1
                  : analyst.status == 2 && reportsFromAnalyst <= 1
                  ? 0
                  : analyst.status,
            },
          });
        }
        const report_ = await this.prisma.report.delete({
          where: { id },
        });

        return { statusCode: 200, data: report_ };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code) };
    }
  }
}
