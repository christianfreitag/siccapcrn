import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestInvestigatedService } from './request_investigated.service';
import { CreateRequestInvestigatedDto } from './dto/create-request_investigated.dto';

import { InvestigatedNotFoundException } from './exceptions/InvestigatedNotFound.exception';
import { ServerFailedException } from 'src/exceptions/ServerFailed.exception';
import { ServiceUnavailableException } from 'src/exceptions/ServiceUnavailable.exception';
import { RequestNotFoundException } from 'src/requests/exceptions/RequestNotFound.exception';
import { InvestigatedAlreadyExistsException } from './exceptions/InvestigatedAlreadyExists.exception copy';

@Controller('request-investigated')
export class RequestInvestigatedController {
  constructor(
    private readonly requestInvestigatedService: RequestInvestigatedService,
  ) {}

  private errorCodeHandler(code: number) {
    switch (code) {
      case 404:
        throw new RequestNotFoundException();
      case 405:
        throw new InvestigatedNotFoundException();
      case 409:
        throw new InvestigatedAlreadyExistsException();
      case 500:
        throw new ServerFailedException();
      default:
        throw new ServiceUnavailableException();
    }
  }

  @Post(':id_request')
  async create(
    @Body() createRequestInvestigatedDto: CreateRequestInvestigatedDto,
    @Param('id_request') id_request: string,
  ) {
    const investigatedrequest = await this.requestInvestigatedService.create(
      createRequestInvestigatedDto,
      id_request,
    );
    if (investigatedrequest.statusCode == 200) {
      return investigatedrequest.data;
    } else {
      this.errorCodeHandler(investigatedrequest.statusCode);
    }
  }

  @Get(':id_request')
  async findAll(@Param('id_request') id: string) {
    const investigatedrequest = await this.requestInvestigatedService.findAll(
      id,
    );
    if (investigatedrequest.statusCode == 200) {
      return investigatedrequest.data;
    } else {
      this.errorCodeHandler(investigatedrequest.statusCode);
    }
  }

  @Delete(':id_request/:id')
  async remove(
    @Param('id') id: string,
    @Param('id_request') id_request: string,
  ) {
    const investigatedrequest = await this.requestInvestigatedService.remove(
      id,
      id_request,
    );
    if (investigatedrequest.statusCode == 200) {
      return investigatedrequest.data;
    } else {
      this.errorCodeHandler(investigatedrequest.statusCode == 404 ? 405 : 404);
    }
  }
}
