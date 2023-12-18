import { PartialType } from '@nestjs/mapped-types';
import { IsEmpty } from 'class-validator';
import { CreateVacationsDto } from './create-vacations.dto';

export class UpdateVacationsDto extends PartialType(CreateVacationsDto) {}
