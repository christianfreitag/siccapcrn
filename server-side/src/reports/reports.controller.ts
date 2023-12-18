import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  HttpCode,
  Post,
  Res,
  Query,
  Request,
  UploadedFile,
  UseFilters,
  UseInterceptors,
  StreamableFile,
} from '@nestjs/common';
import { Express, Response } from 'express';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ReferenceErrorException } from 'src/exceptions/ReferenceError.exception';
import { ServerFailedException } from 'src/exceptions/ServerFailed.exception';
import { ServiceUnavailableException } from 'src/exceptions/ServiceUnavailable.exception';
import { CreateReportsDto } from './dto/reports-create.dto';
import { UpdateReportsDto } from './dto/reports-update.dto';
import { ReportAlreadyExistsException } from './exceptions/ReportAlreadyExists.exception';
import { ReportNotFoundException } from './exceptions/ReportNotFound.exception';
import { ReportsService } from './reports.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UsersService } from 'src/users/users.service';
import { createReadStream, ReadStream, rmSync } from 'fs';
import { send } from 'process';

var fs = require('fs');
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  errorCodeHandler(code: number) {
    switch (code) {
      case 404:
        throw new ReportNotFoundException();

      case 4001:
        throw new ReferenceErrorException();
      case 409:
        throw new ReportAlreadyExistsException();
      case 500:
        throw new ServerFailedException();
      case 400.1:
        throw new BadRequestException(
          'O analista selecionado não existe ou esta em período de afastamento.',
        );
      case 400.2:
        throw new BadRequestException(
          'Não é possivel movimentar o relatório sem definir um analista',
        );
      default:
        throw new ServiceUnavailableException();
    }
  }

  @Get('/download/:filename')
  @HttpCode(201)
  async getFile(@Res() res: Response, @Param('filename') filename: string) {
    let isFile = false;
    fs.exists(
      join(process.cwd(), 'src/uploads/reports/' + filename),
      function (exists) {
        if (exists) {
          var file = createReadStream(
            join(process.cwd(), 'src/uploads/reports/' + filename),
          );
          res.set({
            'Content-Type': 'image/pdf',
            'Content-Disposition': 'attachment; filename="' + filename + '"',
          });

          return file.pipe(res);
        } else {
          return res.status(404).send();
        }
      },
    );
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads/reports',
        filename: (req, file, callback) => {
          if (extname(file.originalname) == ('.pdf' || '.docx' || '.doc')) {
            const sufix =
              'dr1987' +
              Date.now() +
              'm3u20224M0r2l@bld89labldfr31t40gcr15t14n9' +
              Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${sufix}${ext}`;
            callback(null, filename);
          } else {
            callback(null, null);
          }
        },
      }),
    }),
  )
  async upload(@UploadedFile() files: Express.Multer.File) {
    return files.filename;
  }

  @Post()
  async create(@Body() createReportsDto: CreateReportsDto, @Request() req) {
    createReportsDto.created_by = req.user.data.sub;

    const report_ = await this.reportsService.create(createReportsDto);

    if (report_.statusCode == 200) {
      return report_.data;
    } else {
      this.errorCodeHandler(report_.statusCode);
    }
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    const reports_ =
      query.countOnly == 'true'
        ? await this.reportsService.count(query, req.user.data)
        : await this.reportsService.findAll(query, req.user.data);
    if (reports_.statusCode == 200) {
      return reports_.data;
    } else {
      this.errorCodeHandler(reports_.statusCode);
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const report_ = await this.reportsService.findOne(id, req.user.data);
    if (report_.statusCode == 200) {
      return report_.data;
    } else {
      this.errorCodeHandler(report_.statusCode);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReportsDto: UpdateReportsDto,
    @Request()
    req,
    @Query() query,
  ) {
    const report_ = await this.reportsService.update(
      id,
      query,
      updateReportsDto,
      req.user.data,
    );
    if (report_.statusCode == 200) {
      return report_.data;
    } else {
      this.errorCodeHandler(report_.statusCode);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const report_ = await this.reportsService.remove(id, req.user.data);
    if (report_.statusCode == 200) {
      return report_.data;
    } else {
      this.errorCodeHandler(report_.statusCode);
    }
  }
}
