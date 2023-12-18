import { Injectable } from '@nestjs/common';
import { Investigated, Investigated_requests } from '@prisma/client';
import e from 'express';
import { PrismaService } from 'src/database/services/prisma.service';
import { handlePrismaExceptionCode } from 'src/exceptions/handlePrismaExceptionCode';
import { CreateRequestInvestigatedDto } from './dto/create-request_investigated.dto';
import { UpdateRequestInvestigatedDto } from './dto/update-request_investigated.dto';

@Injectable()
export class RequestInvestigatedService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createInvestigatedDto: CreateRequestInvestigatedDto,
    id_request: string, //Adicionar direto na tebela de relacionamento de request com investigated
  ): Promise<{
    statusCode: number;
    data?: Partial<Investigated_requests>;
    detail?: {};
  }> {
    const data = createInvestigatedDto;
    try {
      const investigated = await this.prisma.investigated.findFirst({
        where: {
          cpf: data.cpf,
        },
      });
      const investigatedrequest =
        await this.prisma.investigated_requests.create({
          data: {
            request: {
              connect: {
                id: id_request,
              },
            },
            investigated: !investigated
              ? {
                  create: {
                    name: data.name,
                    cpf: data.cpf.replace('/./gi', '').replace('/-/gi', ''), //E se o CPF ja existir ? Devo apenas atribuir o id do cpf ja existente a relação com o request
                  },
                }
              : { connect: { id: investigated.id } },
          },
          select: {
            investigated: { select: { name: true, cpf: true, id: true } },
            id: true,
            id_request: true,
          },
        });

      return { statusCode: 200, data: investigatedrequest };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findAll(id_request: string): Promise<{
    statusCode: number;
    data?: Partial<Investigated>[];
    detail?: {};
  }> {
    try {
      const investigatedrequest = await this.prisma.investigated.findMany({
        where: {
          Investigated_requests: { some: { id_request: id_request } },
        },
        select: {
          Investigated_requests: true,
          name: true,
          cpf: true,
          id: true,
        },
      });

      return { statusCode: 200, data: investigatedrequest };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async remove(
    id: string,
    id_request: string,
  ): Promise<{
    statusCode: number;
    data?: Partial<Investigated>;
    detail?: {};
  }> {
    try {
      const count_inv_total = await this.prisma.investigated_requests.findMany({
        where: { id_investigated: id },
      });

      const investigatedrequest =
        count_inv_total.length <= 1 &&
        count_inv_total[0].id_request == id_request
          ? await this.prisma.investigated.delete({
              where: { id: id },
            })
          : await this.prisma.investigated_requests.delete({
              where: {
                id_request_id_investigated: {
                  id_investigated: id,
                  id_request: id_request,
                },
              },
            });

      if (investigatedrequest) {
        return { statusCode: 200, data: investigatedrequest }; //InvestigatedNotFound - criar esse handle
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }
}
