import { Module } from '@nestjs/common';
import { RequestInvestigatedService } from './request_investigated.service';
import { RequestInvestigatedController } from './request_investigated.controller';
import { PrismaService } from 'src/database/services/prisma.service';

@Module({
  controllers: [RequestInvestigatedController],
  providers: [RequestInvestigatedService, PrismaService],
})
export class RequestInvestigatedModule {}
