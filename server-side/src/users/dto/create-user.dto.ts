import { Exclude, plainToClass } from 'class-transformer';
import {
  Contains,
  IsEmail,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
  notContains,
} from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'Tipo de dado incorreto para "nome".',
  })
  @Length(4, 25, { message: 'Nome de tamanho inválido.' })
  name: string;

  @IsEmail(IsString(), { message: 'Digite um endereço de email valido.' })
  email: string;

  @IsNotEmpty({ message: 'Campo de CPF não foi preenchido.' })
  @IsString({ message: 'O CPF que digitou é invalido.' })
  cpf: string;

  @IsInt({ message: 'Nivel de usuario deve ser um valor numérico.' })
  user_level: number;

  @IsString()
  @MinLength(8, { message: 'A senha deve conter ao menos 8 dígitos.' })
  password: string;
}

//Para deixar opcional basta adicionar um ? após o nome, ex:  name?:string
