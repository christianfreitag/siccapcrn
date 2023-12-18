import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  RequestMapping,
  Put,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators';

import { ServerFailedException } from 'src/exceptions/ServerFailed.exception';
import { ServiceUnavailableException } from 'src/exceptions/ServiceUnavailable.exception';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CaseAlreadyExistsException } from './exceptions/CaseAlreadyExists.exception';
import { CaseNotFoundException } from './exceptions/CaseNotFound.exception';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  private errorCodeHandler(code: number) {
    switch (code) {
      case 404:
        throw new CaseNotFoundException();
      case 409:
        throw new CaseAlreadyExistsException();
      case 500:
        throw new ServerFailedException();
      default:
        throw new ServiceUnavailableException();
    }
  }
  @Post()
  async create(@Body() createCaseDto: CreateCaseDto, @Request() req) {
    createCaseDto.created_by = req.user.data.sub;
    const case_ = await this.casesService.create(createCaseDto);
    if (case_.statusCode == 200) {
      return case_.data;
    } else {
      this.errorCodeHandler(case_.statusCode);
    }
  }

  @Get()
  async findAll(@Request() req, @Query() query) {
    const cases_ =
      query.countOnly == 'false'
        ? await this.casesService.findAll(query, req.user.data)
        : await this.casesService.count(query, req.user.data);

    if (cases_.statusCode == 200) {
      return cases_.data;
    } else {
      this.errorCodeHandler(cases_.statusCode);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const case_ = await this.casesService.findOne(id, req.user.data);
    if (case_.statusCode == 200) {
      return case_.data;
    } else {
      this.errorCodeHandler(case_.statusCode);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
    @Request() req,
  ) {
    const case_ = await this.casesService.update(
      id,
      updateCaseDto,
      req.user.data,
    );
    if (case_.statusCode == 200) {
      return case_.data;
    } else {
      this.errorCodeHandler(case_.statusCode);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const case_ = await this.casesService.remove(id, req.user.data);
    if (case_.statusCode == 200) {
      return case_.data;
    } else {
      this.errorCodeHandler(case_.statusCode);
    }
  }
}
