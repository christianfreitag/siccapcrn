import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';

import { ServerFailedException } from 'src/exceptions/ServerFailed.exception';
import { ServiceUnavailableException } from 'src/exceptions/ServiceUnavailable.exception';
import { CasesMovementService } from './casesMovement.service';
import { CreateCaseMovementDto } from './dto/create-caseMovement.dto';
import { CaseMovementAlreadyExistsException } from './exceptions/CaseMovementAlreadyExists.exception';
import { CaseMovementNotFoundException } from './exceptions/CaseMovementNotFound.exception';

@Controller('casesMovement')
export class CasesMovementController {
  constructor(private readonly casesService: CasesMovementService) {}

  private errorCodeHandler(code: number) {
    switch (code) {
      case 404:
        throw new CaseMovementNotFoundException();
      case 409:
        throw new CaseMovementAlreadyExistsException();
      case 500:
        throw new ServerFailedException();
      default:
        throw new ServiceUnavailableException();
    }
  }
  @Post()
  async create(
    @Body() createCaseMovementDto: CreateCaseMovementDto,
    @Request() req,
  ) {
    createCaseMovementDto.created_by = req.user.data.sub;
    const case_ = await this.casesService.create(createCaseMovementDto);
    if (case_.statusCode == 200) {
      return case_.data;
    } else {
      this.errorCodeHandler(case_.statusCode);
    }
  }

  @Get(':id')
  async findAll(@Param('id') id: string, @Request() req) {
    const cases_ = await this.casesService.findAll(req.user.data, id);

    if (cases_.statusCode == 200) {
      return cases_.data;
    } else {
      this.errorCodeHandler(cases_.statusCode);
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
