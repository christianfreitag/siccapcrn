import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsDate,
  IsEmpty,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateCaseDto } from './create-case.dto';

export class UpdateCaseDto extends PartialType(CreateCaseDto) {
  @IsOptional()
  created_by: string;
}
