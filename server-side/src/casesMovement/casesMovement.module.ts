import { Module } from '@nestjs/common';
import { CasesMovementService } from './casesMovement.service';
import { CasesMovementController } from './casesMovement.controller';
import { PrismaService } from 'src/database/services/prisma.service';

@Module({
  controllers: [CasesMovementController],
  providers: [CasesMovementService, PrismaService],
})
export class CaseMovementModule {}
