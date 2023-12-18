import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ServerFailedException } from '../exceptions/ServerFailed.exception';
import { ServiceUnavailableException } from '../exceptions/ServiceUnavailable.exception';
import { UserAlreadyExistsExceptions } from './exceptions/UserAlreadyExists.exception';
import { UserNotFoundException } from './exceptions/userNotFound.exception';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Public } from 'src/auth/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  errorCodeHandler(code: number) {
    switch (code) {
      case 404:
        throw new UserNotFoundException();
      case 409:
        throw new UserAlreadyExistsExceptions();
      case 500:
        throw new ServerFailedException();
      default:
        throw new ServiceUnavailableException();
    }
  }

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    createUserDto.user_level = 1;
    const user = await this.usersService.create(createUserDto);

    if (user.statusCode == 200) {
      return user.data;
    } else {
      this.errorCodeHandler(user.statusCode);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() query: Record<string, any>,
    @Request() req,
  ): Promise<Partial<User>[]> {
    if (req.user.data.ulevel == 2) {
      const users = await this.usersService.findAll(query); //o usuario consegue ver todos outros usuarios ? não precisaria ter um level de permissão maior pra isso ?
      if (users.statusCode == 200) {
        //E pedir demais o usuario ter seus casos em privado de outros usuarios ?
        return users.data;
      } else {
        this.errorCodeHandler(users.statusCode);
      }
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Partial<User>> {
    if (req.user.data.ulevel == 2) {
      const user = await this.usersService.findOne(id);
      if (user.statusCode == 200) {
        return user.data;
      } else {
        this.errorCodeHandler(user.statusCode);
      }
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
    @Request() req,
  ): Promise<Partial<User>> {
    const user = await this.usersService.update(
      id,
      updateUserDto,
      req.user.data,
    );
    if (user.statusCode == 200) {
      return user.data;
    } else {
      this.errorCodeHandler(user.statusCode);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Partial<User>> {
    if (req.user.data.ulevel == 2) {
      const user = await this.usersService.remove(id);
      if (user.statusCode == 200) {
        return user.data;
      } else {
        this.errorCodeHandler(user.statusCode);
      }
    } else {
      throw new NotFoundException();
    }
  }
}
