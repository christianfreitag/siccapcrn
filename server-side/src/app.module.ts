import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './database/services/prisma.service';
import { UsersModule } from './users/users.module';
import { CasesModule } from './cases/cases.module';
import { AnalystsModule } from './analysts/analysts.module';
import { ReportsService } from './reports/reports.service';
import { ReportsModule } from './reports/reports.module';
import { VacationsModule } from './vacations/vacations.module';
import { AuthModule } from './auth/auth.module';
import { RequestsModule } from './requests/requests.module';
import { RequestInvestigatedModule } from './request_investigated/request_investigated.module';
import { CaseMovementModule } from './casesMovement/casesMovement.module';


@Module({
  imports: [
    UsersModule,
    CasesModule,
    CaseMovementModule,
    AnalystsModule,
    ReportsModule,
    VacationsModule,
    AuthModule,
    RequestsModule,
    RequestInvestigatedModule,
  ],
  providers: [PrismaService],
})
export class AppModule  {
  
}
