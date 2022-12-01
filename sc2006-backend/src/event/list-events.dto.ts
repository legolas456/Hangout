import { IsArray, IsString } from 'class-validator';
import { ListEventsReq } from '../../../sc2006-common/src';

export class ListEventsDto implements ListEventsReq {
	@IsArray()
	@IsString({ each: true })
	eventUuids: string[];

	@IsString()
	userUuid: string;
}
