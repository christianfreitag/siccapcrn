import {
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
import { count } from 'console';
import { ServerFailedException } from 'src/exceptions/ServerFailed.exception';
import { ServiceUnavailableException } from 'src/exceptions/ServiceUnavailable.exception';
import { AnalystsService } from './analysts.service';
import { CreateAnalystsDto } from './dto/create-analysts.dto';
import { UpdateAnalystsDto } from './dto/update-analysts.dto';
import { AnalystAlreadyExistException } from './exceptions/AnalystAlreadyExists.exception';
import { AnalystNotFoundException } from './exceptions/AnalystNotFound.exception';

@Controller('analysts')
export class AnalystsController {
  constructor(private readonly analystsService: AnalystsService) {}

  errorCodeHandler(code: number) {
    switch (code) {
      case 404:
        throw new AnalystNotFoundException();
      case 409:
        throw new AnalystAlreadyExistException();
      case 500:
        throw new ServerFailedException();
      default:
        throw new ServiceUnavailableException();
    }
  }

  @Post()
  async create(@Request() req, @Body() createAnalystsDto: CreateAnalystsDto) {
    createAnalystsDto.created_by = req.user.data.sub;

    const analyst = await this.analystsService.create(createAnalystsDto);
    if (analyst.statusCode == 200) {
      return analyst.data;
    } else {
      this.errorCodeHandler(analyst.statusCode);
    }
  }

  @Get()
  async findAll(@Request() req, @Query() query) {
    const analysts =
      query.countOnly == 'false'
        ? await this.analystsService.findAll(query, req.user.data)
        : await this.analystsService.count(query, req.user.data);
    if (analysts.statusCode == 200) {
      return analysts.data;
    } else {
      this.errorCodeHandler(analysts.statusCode);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const analyst = await this.analystsService.findOne(id, req.user.data);
    if (analyst.statusCode == 200) {
      return analyst.data;
    } else {
      this.errorCodeHandler(analyst.statusCode);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnalystsDto: UpdateAnalystsDto,
    @Request() req,
  ) {
    const analyst = await this.analystsService.update(
      id,
      updateAnalystsDto,
      req.user.data,
    );
    if (analyst.statusCode == 200) {
      return analyst.data;
    } else {
      this.errorCodeHandler(analyst.statusCode);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const analyst = await this.analystsService.remove(id, req.user.data);
    if (analyst.statusCode == 200) {
      return analyst.data;
    } else {
      this.errorCodeHandler(analyst.statusCode);
    }
  }
}
