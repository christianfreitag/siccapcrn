import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReportsDto {
  @IsNotEmpty({ message: 'O tipo de relatório não foi definido.' })
  @IsInt({ message: 'O tipo de relatório é um valor numérico.' })
  type: number;

  @IsOptional()
  @IsString({ message: 'O id do caso deve ser um texto.' })
  case_id: string;

  @IsOptional()
  created_by: string;

  @IsOptional()
  @IsInt({ message: 'O "status" esta incorreto.' })
  status: number;

  @IsNotEmpty({
    message: 'O "número do relatório" não foi definido.',
  })
  @IsString({
    message: 'O numero de relatório digitado não é valido.',
  })
  num_report: string;

  @IsOptional()
  @IsString({ message: 'Arquivo de relatório esta incorreto.' })
  file: string;

  @IsOptional()
  @IsArray()
  step_dates: {}[];
  /*
  @IsOptional()
  @IsDate({ message: 'A Data do envio para o analista não esta correta.' })
  date_sent_analyst: Date;

  @IsOptional()
  @IsDate({ message: 'A dava de envio para revisão não esta correta.' })
  date_sent_review: Date;
  @IsOptional()
  @IsDate({ message: 'A dava de retorno da revisão não esta correta.' })
  date_back_review: Date;*/

  @IsOptional()
  @IsString({ message: 'Esse campo deve ser texto.' })
  review_id: string;

  @IsOptional()
  @IsString({ message: 'Esse campo deve ser texto.' })
  analyst_id: string;
}
