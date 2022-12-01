import {
	IsArray,
	IsOptional,
	IsString,
	Matches,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatableUserProps, UpdateUserReq } from '../../../sc2006-common/src';
import { Regex } from '../../../sc2006-common/src';

export class UpdateUserDto implements UpdateUserReq {
	@IsString()
	uuid: string;

	@ValidateNested()
	@Type(() => UserDto)
	user: UpdatableUserProps;
}

export class UserDto implements UpdatableUserProps {
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	preferences: Array<string>;

	@IsOptional()
	schedule: Record<string, { start: string; end: string }[]>;

	@IsOptional()
	@IsString()
	@Matches(Regex.POSTAL_CODE)
	address: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	friendIds: string[];
}
