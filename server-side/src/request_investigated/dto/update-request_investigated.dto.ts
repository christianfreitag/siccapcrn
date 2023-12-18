import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestInvestigatedDto } from './create-request_investigated.dto';

export class UpdateRequestInvestigatedDto extends PartialType(CreateRequestInvestigatedDto) {}
