import { Injectable } from '@nestjs/common';
import { Analyst, Report, Vacation } from '@prisma/client';
import { query } from 'express';
import { userInfo } from 'os';
import { AnalystsModule } from 'src/analysts/analysts.module';
import { PrismaService } from 'src/database/services/prisma.service';
import { handlePrismaExceptionCode } from 'src/exceptions/handlePrismaExceptionCode';
import { DefaultSerializer } from 'v8';
import { CreateVacationsDto } from './dto/create-vacations.dto';
import { UpdateVacationsDto } from './dto/update-vacations.dto';

@Injectable()
export class VacationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    query,
    createVacationsDto: CreateVacationsDto,
  ): Promise<{
    statusCode: number;
    data?: Partial<Vacation>;
    detail?: string;
  }> {
    const data = createVacationsDto;

    try {
      //Procura o analista e atribui a variável
      const { analyst, reports } = await this.findAnalystAndHisReports(
        data.analyst_id,
        data.created_by,
        true,
      );
      //faltando os dias
      if (analyst) {
        var departureDays = 0;
        var pendentDays = 0;
        if (data.type == 0) {
          departureDays =
            this.calcPendentDays(data.date_sche_ini, data.date_sche_end) + 1;
          if (analyst.pending_vacation_days < departureDays) {
            return {
              statusCode: 400.2,
            };
          }
        }

        const vacationsRegistered = await this.prisma.vacation.findMany({
          where: {
            AND: [
              { created_by: data.created_by },
              { analyst_id: data.analyst_id },
              {
                OR: [
                  {
                    date_sche_ini: {
                      gte: data.date_sche_ini,
                      lte: data.date_sche_end,
                    },
                  },
                  {
                    date_sche_end: {
                      gte: data.date_sche_ini,
                      lte: data.date_sche_end,
                    },
                  },
                  {
                    date_sche_ini: {
                      lte: data.date_sche_ini,
                    },
                    date_sche_end: {
                      gte: data.date_sche_end,
                    },
                  },
                  {
                    date_sche_ini: {
                      gte: data.date_sche_ini,
                    },
                    date_sche_end: {
                      lte: data.date_sche_end,
                    },
                  },
                ],
              },
            ],
          },
        });

        if (vacationsRegistered.length <= 0) {
          if (data.date_ini != null) {
            if (data.date_end != null) {
              if (data.alterpendentdays) {
                pendentDays =
                  this.calcPendentDays(data.date_ini, data.date_sche_ini) -
                  this.calcPendentDays(data.date_end, data.date_sche_end);
              }
            }
          }
          await this.prisma.analyst.update({
            where: { id: data.analyst_id },
            data: {
              pending_vacation_days:
                data.type == 0
                  ? analyst.pending_vacation_days - departureDays - pendentDays
                  : analyst.pending_vacation_days - pendentDays,
              status:
                data.date_ini != null
                  ? data.date_end != null
                    ? analyst.status
                    : analyst.status == 2
                    ? 3
                    : 1
                  : analyst.status,
            },
          });
        } else {
          return {
            statusCode: 409,
            detail:
              'Já existe um afastamento nesse período para este analista.',
          };
        }
      } else {
        return {
          statusCode: 400,
          detail: 'Analista selecionado não foi encontrado',
        };
      }
      const vacation = await this.prisma.vacation.create({
        data,
        select: {
          id: true,
          type: true,
          date_sche_ini: true,
          date_sche_end: true,
          date_ini: true,
          date_end: true,
          alterpendentdays: true,
          created_by: true,
          analyst: { select: { name: true, id: true } },
        },
      });
      return { statusCode: 200, data: vacation };
    } catch (e) {
      return { statusCode: 500 };
    }
  }
  async findAll(
    query,
    user,
  ): Promise<{
    statusCode: number;
    data?: [number, Partial<Vacation>[]];
    detail?: string;
  }> {
    //filtrar por intervalo de ferias
    const date = new Date();
    date.setHours(20, 0, 0, 0);

    const nPerPage = 8;
    try {
      const vacations = await this.prisma.$transaction([
        this.prisma.vacation.count({
          where: {
            created_by: user.sub,
            //Eu apaguei a data de create
            AND: [
              query.analystId != undefined || query.analystId != null
                ? {
                    analyst_id: query.analystId,
                  }
                : null,
              query.status == 1 // aguardando
                ? {
                    OR: [
                      {
                        date_sche_ini: {
                          lte: date,
                        },
                        date_ini: null,
                      },
                      { date_sche_end: { lte: date }, date_end: null },
                    ],
                  }
                : null,
              query.status == 2 //Agendado
                ? {
                    NOT: [
                      {
                        date_sche_ini: undefined,
                        date_sche_end: undefined,
                      },
                    ],
                    date_ini: null,
                  }
                : null,
              query.status == 3 //Em andamento
                ? {
                    NOT: [
                      {
                        date_ini: null,
                      },
                    ],
                    date_end: null,
                  }
                : null,
              query.status == 4 //finalizados
                ? {
                    date_end: { not: null },
                  }
                : null,
              query.start_date != '' || query.end_date != ''
                ? {
                    date_sche_ini:
                      query.start_date != ''
                        ? {
                            gte: query.start_date,
                            lte: query.end_date,
                          }
                        : {},
                  }
                : null,
              query.dateFilter == 1
                ? query.dateFilterFrom != '' && query.dateFilterTo != ''
                  ? {
                      create_at: {
                        gte: query.dateFilterFrom,
                        lte: query.dateFilterTo,
                      },
                    }
                  : null
                : null,
              query.dateFilter == 2
                ? query.dateFilterFrom != '' && query.dateFilterTo != ''
                  ? {
                      OR: [
                        {
                          date_sche_ini: {
                            gte: query.dateFilterFrom,
                            lte: query.dateFilterTo,
                          },
                        },
                        {
                          date_sche_end: {
                            gte: query.dateFilterFrom,
                            lte: query.dateFilterTo,
                          },
                        },
                      ],
                    }
                  : null
                : null,
              query.dateFilter == 3
                ? query.dateFilterFrom && query.dateFilterTo
                  ? {
                      OR: [
                        {
                          date_ini: {
                            gte: query.dateFilterFrom,
                            lte: query.dateFilterTo,
                          },
                        },
                        {
                          date_end: {
                            gte: query.dateFilterFrom,
                            lte: query.dateFilterTo,
                          },
                        },
                      ],
                    }
                  : {}
                : null,
              {
                OR: [
                  query.dateTo && query.dateFrom
                    ? {
                        date_sche_ini: {
                          gte: query.dateFrom,
                          lte: query.dateTo,
                        },
                      }
                    : {},
                  query.dateTo && query.dateFrom
                    ? {
                        date_sche_end: {
                          gte: query.dateFrom,
                          lte: query.dateTo,
                        },
                      }
                    : {},
                ],
              },
            ],
            OR: [
              {
                analyst: {
                  name: { contains: query.searchData, mode: 'insensitive' },
                },
              },
            ],
          },
        }),
        this.prisma.vacation.findMany({
          take: query.page != 0 ? nPerPage : undefined,
          skip:
            query.page != 0 ? nPerPage * (parseInt(query.page) - 1) : undefined,
          where: {
            created_by: user.sub,
            //Eu apaguei a data de create
            AND: [
              query.typeFilter != undefined && query.typeFilter != null
                ? {
                    type: parseInt(query.typeFilter),
                  }
                : null,
              query.analystId != undefined && query.analystId != null
                ? {
                    analyst_id: query.analystId,
                  }
                : null,
              query.status == 1 // aguardando
                ? {
                    OR: [
                      {
                        date_sche_ini: {
                          lte: date,
                        },
                        date_ini: null,
                      },
                      { date_sche_end: { lte: date }, date_end: null },
                    ],
                  }
                : null,
              query.status == 2 //Agendado
                ? {
                    NOT: [
                      {
                        date_sche_ini: undefined,
                        date_sche_end: undefined,
                      },
                    ],
                    date_ini: null,
                  }
                : null,
              query.status == 3 //Em andamento
                ? {
                    NOT: [
                      {
                        date_ini: null,
                      },
                    ],
                    date_end: null,
                  }
                : null,
              query.status == 4 //finalizados
                ? {
                    date_end: { not: null },
                  }
                : null,
              query.start_date != '' || query.end_date != ''
                ? {
                    date_sche_ini:
                      query.start_date != ''
                        ? {
                            gte: query.start_date,
                            lte: query.end_date,
                          }
                        : {},
                  }
                : null,
              query.dateFilter == 1
                ? query.dateFilterFrom != '' && query.dateFilterTo != ''
                  ? {
                      create_at: {
                        gte: query.dateFilterFrom,
                        lte: query.dateFilterTo,
                      },
                    }
                  : null
                : null,
              query.dateFilter == 2
                ? query.dateFilterFrom != '' && query.dateFilterTo != ''
                  ? {
                      OR: [
                        {
                          date_sche_ini: {
                            gte: query.dateFilterFrom,
                            lte: query.dateFilterTo,
                          },
                        },
                        {
                          date_sche_end: {
                            gte: query.dateFilterFrom,
                            lte: query.dateFilterTo,
                          },
                        },
                      ],
                    }
                  : null
                : null,
              query.dateFilter == 3
                ? query.dateFilterFrom && query.dateFilterTo
                  ? {
                      OR: [
                        {
                          date_ini: {
                            gte: query.dateFilterFrom,
                            lte: query.dateFilterTo,
                          },
                        },
                        {
                          date_end: {
                            gte: query.dateFilterFrom,
                            lte: query.dateFilterTo,
                          },
                        },
                      ],
                    }
                  : {}
                : null,
              {
                OR: [
                  query.dateTo && query.dateFrom
                    ? {
                        OR: [
                          {
                            date_sche_ini: {
                              gte: query.dateFrom,
                              lte: query.dateTo,
                            },
                          },
                          {
                            date_sche_ini: {
                              lte: query.dateFrom,
                            },
                            date_sche_end: {
                              gte: query.dateFrom,
                            },
                          },
                        ],
                      }
                    : {},
                  query.dateTo && query.dateFrom
                    ? {
                        date_sche_end: {
                          gte: query.dateFrom,
                          lte: query.dateTo,
                        },
                      }
                    : {},
                ],
              },
            ],
            OR: [
              {
                analyst: {
                  name: { contains: query.searchData, mode: 'insensitive' },
                },
              },
            ],
          },

          orderBy: { date_sche_ini: 'asc' },
          select: {
            id: true,
            type: true,
            date_sche_ini: true,
            date_sche_end: true,
            date_ini: true,
            date_end: true,
            alterpendentdays: true,
            created_by: true,
            analyst: { select: { name: true, id: true } },
          },
        }),
      ]);

      return { statusCode: 200, data: vacations };
    } catch (e) {
      return { statusCode: 500 };
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
      // 0-agendados / 1 - andamento // 2 -  aguardando confirmação
      var countDepartures = [0, 0, 0];
      const date = new Date();
      date.setHours(20, 0, 0, 0);
      const departures = await this.prisma.$transaction([
        this.prisma.vacation.count({
          where: {
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},
            created_by: user.sub,

            OR: [
              {
                date_sche_ini: {
                  lte: date,
                },
                date_ini: null,
              },
              { date_sche_end: { lte: date }, date_end: null },
            ],
          },
        }),
        this.prisma.vacation.count({
          where: {
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},
            created_by: user.sub,
            NOT: [
              {
                date_sche_ini: undefined,
                date_sche_end: undefined,
              },
            ],
            date_ini: null,
            date_end: null,
          },
        }),
        this.prisma.vacation.count({
          where: {
            create_at:
              query.dateFrom && query.dateTo
                ? { gte: query.dateFrom, lte: query.dateTo }
                : {},
            created_by: user.sub,

            NOT: [
              {
                date_ini: null,
              },
            ],

            date_end: null,
          },
        }),
      ]);

      return { statusCode: 200, data: departures };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code) };
    }
  }

  async findOne(
    id: string,
    user,
  ): Promise<{
    statusCode: number;
    data?: Partial<Vacation>;
    detail?: string;
  }> {
    try {
      const vacation = await this.prisma.vacation.findFirst({
        where: { id, created_by: user.sub },
        select: {
          analyst: true,
          created_by: true,
          create_at: true,
          id: true,
          type: true,

          date_ini: true,
          date_end: true,
          date_sche_end: true,
          date_sche_ini: true,
          alterpendentdays: true,
        },
      });
      if (vacation) {
        return { statusCode: 200, data: vacation };
      } else {
        return {
          statusCode: 404,
        };
      }
    } catch (e) {
      return { statusCode: 500 };
    }
  }

  async update(
    id: string,
    updateVacationsDto: UpdateVacationsDto,
    user,
  ): Promise<{
    statusCode: number;
    data?: Partial<Vacation>;
    detail?: string;
  }> {
    /* 
      Editar:
        - 
        - 
    */
    const data = updateVacationsDto;

    try {
      //Procura o analista e atribui a variável
      const { analyst, reports, departures } =
        await this.findAnalystAndHisReports(
          data.analyst_id,
          data.created_by,
          true,
        );
      if (analyst) {
        var pendentDays = 0;
        var oldPendentDays = 0;

        const old_departure = await this.prisma.vacation.findFirst({
          where: { id: id, created_by: user.sub },
        });

        if (old_departure.alterpendentdays) {
          oldPendentDays =
            this.calcPendentDays(
              old_departure.date_ini,
              old_departure.date_sche_ini,
            ) -
            this.calcPendentDays(
              old_departure.date_end,
              old_departure.date_sche_end,
            );

          console.log(
            'OLD:',
            this.calcPendentDays(
              old_departure.date_ini,
              old_departure.date_sche_ini,
            ),
            this.calcPendentDays(
              old_departure.date_end,
              old_departure.date_sche_end,
            ),
          );

          //UPDATE ANALISTA REMOVENDO/ADICIONANDO ANTIGO E REMOVENDO/ADICIONANDO NOVO
        }

        if (data.alterpendentdays && data.date_ini && data.date_end) {
          pendentDays =
            this.calcPendentDays(data.date_ini, old_departure.date_sche_ini) -
            this.calcPendentDays(data.date_end, old_departure.date_sche_end);
        }

        console.log(
          'OLD-->:',
          oldPendentDays,
          '\nNOW:',
          pendentDays,
          '\nCurrent Analyst pdays:',
          analyst.pending_vacation_days,
          '\nAnalystpdays without pdays:',
          analyst.pending_vacation_days + oldPendentDays,
          '\nSLA:',
          analyst.pending_vacation_days + oldPendentDays - pendentDays,
        );
        console.log(
          'DateIni:',
          data.date_ini,
          'Dateend:',
          data.date_end,
          'reports:',
          reports,
        );

        await this.prisma.analyst.update({
          where: { id: data.analyst_id },
          data: {
            //ABAIXO NO TYRUE PRECISO DEFINIR QUE TYPOES DE AFASTAMENTO SOBRA DIAS
            pending_vacation_days:
              analyst.pending_vacation_days + oldPendentDays - pendentDays,
            status:
              data.date_ini && !data.date_end
                ? analyst.status == 2 || analyst.status == 3
                  ? 3
                  : 1
                : (departures == 1 && !old_departure.date_ini) ||
                  departures > 1 ||
                  (departures >= 1 &&
                    old_departure.date_ini &&
                    old_departure.date_end)
                ? reports > 0
                  ? 3
                  : 1
                : analyst.status == 3
                ? reports > 0
                  ? 2
                  : 0
                : 0,
          },
        });

        //UPDATE DEPARTURE COM NOVAS DATAS

        const vacation = await this.prisma.vacation.update({
          where: { id },
          data: {
            date_end: data.date_end,
            date_ini: data.date_ini,
            alterpendentdays: data.alterpendentdays,
          },
          select: {
            id: true,
            type: true,
            date_sche_ini: true,
            date_sche_end: true,
            date_ini: true,
            date_end: true,
            alterpendentdays: true,
            created_by: true,
            analyst: { select: { name: true, id: true } },
          },
        });
        /* 
        //Então é preciso fazer a diferença entre os dias quando adicionado as vacations pois o analista precisa ter os dias pendentes disponíveis.
        if ((data.date_ini && !data.date_end) || data.date_end) {
          //aqui é verificado se o analista existe e  o afastamento ja começou e não terminou e quando data final for adicionada ele muda status do analista pra 0.

          const pendentDays =
            analyst.pending_vacation_days +
            this.calcPendentDays(data.date_sche_end, data.date_end);

          await this.prisma.analyst.update({
            where: { id: data.analyst_id },
            data: {
              //ABAIXO NO TYRUE PRECISO DEFINIR QUE TYPOES DE AFASTAMENTO SOBRA DIAS
              pending_vacation_days:
                data.date_end && true
                  ? pendentDays
                  : analyst.pending_vacation_days,
              status:
                data.date_ini && !data.date_end
                  ? analyst.status == 2
                    ? 3
                    : 1
                  : (analyst.status == 3 || analyst.status == 2) && reports > 0
                  ? 2
                  : 0,
            },
          });
        } */

        return { statusCode: 200, data: vacation };
      } else {
        return {
          statusCode: 404,
          detail: 'Analista selecionado não foi encontrado',
        };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code) };
    }
  }

  async remove(
    id: string,
    user,
  ): Promise<{
    statusCode: number;
    data?: Partial<Vacation>;
    detail?: string;
  }> {
    try {
      const vacationCheck = await this.prisma.vacation.findFirst({
        where: { id: id, created_by: user.sub },
      });

      var pendentDays = 0;
      var pendentDaysGiveBack = 0;

      if (vacationCheck) {
        const { analyst, reports } = await this.findAnalystAndHisReports(
          vacationCheck.analyst_id,
          vacationCheck.created_by,
          true,
        );

        if (analyst) {
          if (vacationCheck.alterpendentdays) {
            pendentDays =
              this.calcPendentDays(
                vacationCheck.date_ini,
                vacationCheck.date_sche_ini,
              ) -
              this.calcPendentDays(
                vacationCheck.date_end,
                vacationCheck.date_sche_end,
              );
          }
          if (vacationCheck.type == 0) {
            pendentDaysGiveBack =
              this.calcPendentDays(
                vacationCheck.date_sche_ini,
                vacationCheck.date_sche_end,
              ) + 1;
          }

          console.log(
            'PEN:',
            pendentDays,
            '\npendTogiveBack:',
            pendentDaysGiveBack,
            '\nAnalyst:',
            analyst.pending_vacation_days,
            '\nanalystLessPend:',
            analyst.pending_vacation_days + pendentDays,
            '\nresult:',
            analyst.pending_vacation_days + pendentDays + pendentDaysGiveBack,
          );

          await this.prisma.analyst.update({
            where: { id: vacationCheck.analyst_id },
            data: {
              pending_vacation_days:
                analyst.pending_vacation_days +
                pendentDays +
                pendentDaysGiveBack,
              status:
                vacationCheck.date_ini && !vacationCheck.date_end
                  ? analyst.status == 3
                    ? 2
                    : 1
                  : (analyst.status == 3 || analyst.status == 2) && reports > 0
                  ? 2
                  : 0,
            },
          });

          const vacation = await this.prisma.vacation.delete({
            where: { id },
          });

          return { statusCode: 200, data: vacation };
        }
      } else {
        return {
          statusCode: 404.1,
        };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code) };
    }
  }

  calcPendentDays(date_sche_ini, date_sche_end): number {
    const dateFrom = new Date(date_sche_ini);
    const dateTo = new Date(date_sche_end);
    var Difference_In_Time = dateTo.getTime() - dateFrom.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  async findAnalystAndHisReports(
    id: string,
    created_by: string,
    report: boolean,
  ): Promise<{
    analyst: Partial<Analyst>;
    reports: number;
    departures: number;
  }> {
    return {
      analyst: await this.prisma.analyst.findFirst({
        where: { id: id, created_by: created_by }, //procura o analista para fazer as verificações e modificações no status daquele analista
      }),
      reports: report
        ? await this.prisma.report.count({
            where: { analyst_id: id, status: 1 },
          })
        : 0,
      departures: await this.prisma.vacation.count({
        where: { analyst_id: id, date_end: null, NOT: [{ date_ini: null }] },
      }),
    };
  }
}
