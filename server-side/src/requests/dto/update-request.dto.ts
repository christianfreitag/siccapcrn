import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEmpty } from 'class-validator';
import { CreateRequestDto } from './create-request.dto';

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @IsEmpty({ message: 'Ocorreu u problema de solicitação.' })
  created_by?: string;
}
