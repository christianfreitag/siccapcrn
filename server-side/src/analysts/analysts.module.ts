import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/services/prisma.service';
import { AnalystsController } from './analysts.controller';
import { AnalystsService } from './analysts.service';

@Module({
  controllers: [AnalystsController],
  providers: [AnalystsService, PrismaService],
})
export class AnalystsModule {}
