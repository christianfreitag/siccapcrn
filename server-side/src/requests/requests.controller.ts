import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ServerFailedException } from 'src/exceptions/ServerFailed.exception';
import { ServiceUnavailableException } from 'src/exceptions/ServiceUnavailable.exception';
import { RequestAlreadyExistsException } from './exceptions/RequestAlreadyExists.exception';
import { RequestNotFoundException } from './exceptions/RequestNotFound.exception';
import { request } from 'http';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  private errorCodeHandler(code: number) {
    switch (code) {
      case 404:
        throw new RequestNotFoundException();
      case 409:
        throw new RequestAlreadyExistsException();
      case 500:
        throw new ServerFailedException();
      default:
        throw new ServiceUnavailableException();
    }
  }

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto, @Request() req) {
    createRequestDto.created_by = req.user.data.sub;
    const request_ = await this.requestsService.create(createRequestDto);
    if (request_.statusCode == 200) {
      return request_.data;
    } else {
      this.errorCodeHandler(request_.statusCode);
    }
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    const requests_ = await this.requestsService.findAll(query, req.user.data);
    if (requests_.statusCode == 200) {
      return requests_.data;
    } else {
      this.errorCodeHandler(requests_.statusCode);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const request_ = await this.requestsService.findOne(id, req.user.data);
    if (request_.statusCode == 200) {
      return request_.data;
    } else {
      this.errorCodeHandler(request_.statusCode);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @Request() req,
  ) {
    const request_ = await this.requestsService.update(
      id,
      updateRequestDto,
      req.user.data,
    );
    if (request_.statusCode == 200) {
      return request_.data;
    } else {
      this.errorCodeHandler(request_.statusCode);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const request_ = await this.requestsService.remove(id, req.user.data);
    if (request_.statusCode == 200) {
      return request_.data;
    } else {
      this.errorCodeHandler(request_.statusCode);
    }
  }
}
