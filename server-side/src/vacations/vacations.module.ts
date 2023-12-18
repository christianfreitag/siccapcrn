import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/services/prisma.service';
import { VacationsController } from './vacations.controller';
import { VacationsService } from './vacations.service';

@Module({
  controllers: [VacationsController],
  providers: [VacationsService, PrismaService],
})
export class VacationsModule {}
