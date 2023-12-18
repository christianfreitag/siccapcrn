import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'src/database/services/prisma.service';
import { handlePrismaExceptionCode } from 'src/exceptions/handlePrismaExceptionCode';
import { encryptPassword } from 'src/utils/bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ statusCode: number; data?: Partial<User>; detail?: {} }> {
    const { name, email, password, cpf, user_level } = createUserDto;

    try {
      const hashPassword = await encryptPassword(password);
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          user_level,
          cpf: cpf.replace('/./gi', '').replace('/-/gi', ''),
          password: hashPassword,
        },
        select: { id: true, name: true },
      });
      return { statusCode: 200, data: user };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findAll(
    query,
  ): Promise<{ statusCode: number; data?: Partial<User>[]; detail?: {} }> {
    //* -  ? - *
    //Aqui esta pegando todos os elementos, filtrando a busca somente por nome ou email,e caso não tenha filtro algum, ele retorna todos elementos.
    try {
      const user = await this.prisma.user.findMany({
        where:
          query.searchData != '' && query.searchData != undefined
            ? {
                OR: [
                  query.byEmail == 'true'
                    ? {
                        email: {
                          contains: query.searchData,
                          mode: 'insensitive',
                        },
                      }
                    : {},
                  query.byName == 'true'
                    ? {
                        name: {
                          contains: query.searchData,
                          mode: 'insensitive',
                        },
                      }
                    : {},
                ],
              }
            : {},
        select: { id: true, name: true, email: true, cpf: true },
        orderBy: { name: query.order },
      });
      return { statusCode: 200, data: user };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async findOne(
    id: string,
    type?: string,
  ): Promise<{ statusCode: number; data?: Partial<User>; detail?: {} }> {
    try {
      const user = await this.prisma.user.findUnique({
        where:
          type == undefined
            ? { id: id }
            : type == 'cpf'
            ? { cpf: id }
            : type == 'email'
            ? { email: id }
            : {},
      });
      if (user) {
        return { statusCode: 200, data: user };
      } else {
        return { statusCode: 404 };
      }
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    user_,
  ): Promise<{ statusCode: number; data?: Partial<User>; detail?: {} }> {
    const { email, password, name, cpf } = updateUserDto;

    try {
      const user = await this.prisma.user.update({
        where: {
          id: user_.ulevel == 2 ? id : user_.sub,
        },
        data: {
          name,
          email,
          password,
          cpf,
        },
        select: {
          name: true,
          id: true,
          email: true,
          cpf: true,
        },
      });

      return { statusCode: 200, data: user };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }

  async remove(
    id: string,
  ): Promise<{ statusCode: number; data?: Partial<User>; detail?: {} }> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
        },
      });
      return { statusCode: 200, data: user };
    } catch (e) {
      return { statusCode: handlePrismaExceptionCode(e.code), detail: e };
    }
  }
}
