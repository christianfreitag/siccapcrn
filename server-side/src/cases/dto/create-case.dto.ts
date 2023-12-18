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

export class CreateCaseDto {
  @IsNotEmpty({
    message: 'O "Nº do LAB" não pode ser deixado em branco.',
  })
  @IsString({
    message: 'O "Nº do LAB" está incorreto.',
  })
  num_caso_lab: string;

  @IsNotEmpty({
    message: 'O "Nº do SEI" não pode ser deixado em branco.',
  })
  @IsString({
    message: 'O "Nº do SEI" está incorreto.',
  })
  num_sei: string;

  @IsNotEmpty({
    message: 'O "Nome da operação" não pode ser deixado em branco.',
  })
  @IsString({
    message: 'O "Nome da operação" está incorreto.',
  })
  operation_name: string;

  @IsNotEmpty({
    message: 'O "Nº de IP" não pode ser deixado em branco.',
  })
  @IsString({
    message: 'O "Nº de IP" está incorreto.',
  })
  ip_number: string;

  @IsOptional()
  @IsInt({ message: 'O valor de validade do caso esta incorreto.' })
  expiresIn: number;

  @IsString({
    message: 'O "Nome da unidade demandante" está incorreta.',
  })
  demandant_unit: string;

  @IsString({ message: 'O "Objeto" está incorreto.' })
  object: string;

  @IsOptional()
  @IsArray()
  step_dates: Date[];

  @IsOptional()
  @IsDateString({ message: 'Data de validade da movimentação esta incorreta.' })
  expiredDate: Date;

  @IsOptional()
  @IsDateString({ message: 'Data de finalização esta incorreta.' })
  end_date: Date;

  @IsOptional()
  created_by: string;
}
