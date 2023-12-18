import {
  IsArray,
  isDate,
  IsDate,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

//verificar campos não obrigatorios

export class CreateCaseMovementDto {
  @IsNotEmpty({
    message: 'O id do caso precisa ser preenchido.',
  })
  @IsString({
    message: 'O id do caso é um valor textual',
  })
  case_id: string;

  @IsNotEmpty({
    message: 'É necessario definir uma data para essa movimentação.',
  })
  @IsDateString({
    message: 'A data esta em um formato incorreto.',
  })
  date: Date;

  @IsNotEmpty({
    message:
      'É necessario definir uma data de expiração para essa movimentação.',
  })
  @IsDateString({
    message: 'A data esta em um formato incorreto.',
  })
  expire_date: Date;

  @IsNotEmpty({
    message: 'É necessario definir um nome a movimentação',
  })
  @IsString({
    message: 'Tipo da movimentação esta incorreto.',
  })
  label: string;

  @IsOptional()
  @IsString({
    message: 'A observação esta em um formato incorreto.',
  })
  observation: string;

  @IsOptional()
  created_by: string;
}
