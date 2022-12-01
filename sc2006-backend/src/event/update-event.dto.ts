import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEventReq, UpdateEventReq } from '../../../sc2006-common/src';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto implements UpdateEventReq {
	@IsString()
	uuid: string;

	@IsString()
	eventResultId: string;

	@ValidateNested()
	@Type(() => CreateEventDto)
	newEvent: CreateEventReq;
}
