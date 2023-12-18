import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsString({
    message:
      'O número da solicitação está incorreto ou o campo não foi preenchido.',
  })
  num_request: string;

  @IsOptional()
  @IsString()
  history: string;

  @IsUUID('all', {
    message: "Campo de 'case_id' deve ser preenchido com um UUID.",
  })
  id_case: string;

  @IsOptional()
  created_by: string;
}
