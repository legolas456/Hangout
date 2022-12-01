import { DbUserRes } from '../constants';
import { PresentableError } from '../utils';

export interface GetUserRes {
	error: Omit<PresentableError, 'name'> | null;
	user: DbUserRes | null;
}

export interface UpdateUserReq {
	uuid: string;
	user: UpdatableUserProps;
}

export type UpdatableUserProps = Pick<
	DbUserRes,
	'address' | 'preferences' | 'schedule' | 'friendIds'
>;
