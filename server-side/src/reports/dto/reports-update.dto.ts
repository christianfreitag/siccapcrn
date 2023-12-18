import { PartialType } from '@nestjs/mapped-types';
import { IsEmpty } from 'class-validator';
import { CreateReportsDto } from './reports-create.dto';

export class UpdateReportsDto extends PartialType(CreateReportsDto) {}
