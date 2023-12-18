import { IsBoolean, isBoolean, IsBooleanString, IsDate, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVacationsDto {
  @IsNotEmpty({message:"É necessario definir um tipo de afastamento."})
  @IsInt({ message: 'O tipo de férias precisa ser um valor numérico.' })
  type: number;

  @IsNotEmpty()
  @IsBoolean()
  alterpendentdays:boolean

  @IsNotEmpty({message:"É definir um agendamento para criar um afastamento."})
  @IsDateString()
  date_sche_ini: Date;

  @IsNotEmpty({message:"É definir um agendamento para criar um afastamento."})
  @IsDateString()
  date_sche_end: Date;

  @IsOptional()
  @IsDateString({ message: 'Insira uma data de inicio correta.' })
  date_ini: Date;

  @IsOptional()
  @IsDateString({ message: 'Insira uma data de fim correta.' })
  date_end: Date;

  @IsNotEmpty({message:"É necessario escolher um analista."})
  @IsString({ message: 'O id do analista precisa ser um texto.' })
  analyst_id: string;

 @IsOptional()
  created_by: string;
}
