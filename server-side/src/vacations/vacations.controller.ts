import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';

import { Public } from 'src/auth/decorators';
import { ServerFailedException } from 'src/exceptions/ServerFailed.exception';
import { ServiceUnavailableException } from 'src/exceptions/ServiceUnavailable.exception';
import { CreateVacationsDto } from './dto/create-vacations.dto';
import { UpdateVacationsDto } from './dto/update-vacations.dto';
import { VacationAlreadyExistsExceptions } from './exceptions/VacationAlreadyExists.exception';
import { VacationNotFoundExceptions } from './exceptions/VacationNotFound.exception';
import { VacationsService } from './vacations.service';

@Controller('departures')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  errorCodeHandler(code: number) {
    switch (code) {
      case 409:
        throw new VacationAlreadyExistsExceptions();
      case 404:
        throw new VacationNotFoundExceptions();
      case 500:
        throw new ServerFailedException();
      case 400.1:
        throw new BadRequestException(
          'Analista não tem dias pendentes suficiente para esse período de afastamento.',
        );
      case 400.2:
        throw new BadRequestException(
          'Analista não tem dias pendentes suficiente para esse período de afastamento.',
        );
      case 404.1:
        throw new VacationNotFoundExceptions(
          'Não foi possível localizar nenhum afastamento com esse id.',
        );
      default:
        throw new ServiceUnavailableException();
    }
  }

  @Post()
  async create(@Body() createVacationsDto: CreateVacationsDto, @Request() req,@Query() query) {
    createVacationsDto.created_by = req.user.data.sub;
    console.log("Ae")
    const vacation = await this.vacationsService.create(query,createVacationsDto);
    if (vacation.statusCode == 200) {
      return vacation.data;
    } else {
      this.errorCodeHandler(vacation.statusCode);
    }
  }
  @Get()
  async findAll(@Query() query, @Request() req) {
    const vacations =
      query.countOnly == 'true'
        ? await this.vacationsService.count(query, req.user.data)
        : await this.vacationsService.findAll(query, req.user.data);
    if (vacations.statusCode == 200) {
      return vacations.data;
    } else {
      this.errorCodeHandler(vacations.statusCode);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const vacation = await this.vacationsService.findOne(id, req.user.data);
    if (vacation.statusCode == 200) {
      return vacation.data;
    } else {
      this.errorCodeHandler(vacation.statusCode);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVacationsDto: UpdateVacationsDto,
    @Request() req,
  ) {
    updateVacationsDto.created_by = req.user.data.sub;
    const vacation = await this.vacationsService.update(id, updateVacationsDto,req.user.data);
    if (vacation.statusCode == 200) {
      return vacation.data;
    } else {
      this.errorCodeHandler(vacation.statusCode);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const vacation = await this.vacationsService.remove(id, req.user.data);
    if (vacation.statusCode == 200) {
      return vacation.data;
    } else {
      this.errorCodeHandler(vacation.statusCode);
    }
  }
}
