import {
  IsEmail,
  IsEmpty,
  IsInt,
  isNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  maxLength,
  MinLength,
} from 'class-validator';

export class CreateAnalystsDto {
  @IsString({
    message:
      'O nome do analista esta incorreto. Preencha os campos corretamente.',
  })
  @MinLength(4, { message: 'O nome precisa ter no mínimo 4 caracteres.' })
  name: string;

  @IsString({
    message:
      'O cpf do analista esta incorreto. Preencha os campos corretamente.',
  })
  @MinLength(14, { message: 'O cpf precisa ter no mínimo 14 caracteres.' })
  @MaxLength(14, { message: 'O cpf precisa ter no máximo 14 caracteres.' })
  cpf: string;

  @IsEmail({ message: 'Email invalido.' })
  @IsOptional()
  email: string;

  @IsPhoneNumber('BR', { message: 'Número de telefone invalido.' })
  @IsOptional()
  whatsapp: string;

  @IsEmpty({ message: 'Erro ao tentar adicionar um status ao analista.' })
  status: number;

  @IsInt({
    message: 'É necessário definir a quantidade de dias pendentes do analista.',
  })
  pending_vacation_days: number;

  @IsOptional()
  created_by: string;
}
