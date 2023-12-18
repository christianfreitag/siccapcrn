import { PartialType } from '@nestjs/mapped-types';
import { IsEmpty } from 'class-validator';
import { CreateAnalystsDto } from './create-analysts.dto';

export class UpdateAnalystsDto extends PartialType(CreateAnalystsDto) {
  @IsEmpty({ message: 'Ocorreu um erro de solicitação' })
  created_by?: string;
}
