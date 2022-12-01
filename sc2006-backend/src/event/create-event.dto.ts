import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsOptional,
	IsString,
	Length,
	Matches,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEventReq, EventParticipant } from '../../../sc2006-common/src';
import { Regex } from '../../../sc2006-common/src';

export class CreateEventDto implements CreateEventReq {
	@IsString()
	@Length(10, 50)
	name: string;

	@IsArray()
	@ArrayMinSize(2)
	@ValidateNested({ each: true })
	@Type(() => ParticipantDto)
	participants: Array<EventParticipant>;
}

export class ParticipantDto {
	@IsOptional()
	@IsString()
	uuid?: string;

	@IsBoolean()
	isCreator: boolean;

	@IsString()
	name: string;

	@IsArray()
	@IsString({ each: true })
	preferences: Array<string>;

	@IsOptional()
	schedule: Record<string, Array<{ start: string; end: string }>>;

	@IsString()
	@Matches(Regex.POSTAL_CODE)
	address: string;
}
