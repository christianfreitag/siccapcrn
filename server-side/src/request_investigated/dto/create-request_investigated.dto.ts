import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequestInvestigatedDto {
  @IsNotEmpty({ message: 'Nome do investigado não pode estar emk branco.' })
  @IsString({ message: 'Nome do investigado foi digitado incorretamente.' })
  name: string;

  @IsNotEmpty({ message: 'Digite um CPF valido.' })
  @IsString({ message: 'CPF do investigado foi digitado incorretamente.' })
  cpf: string;
}
