import { DbUserRes } from '../constants';
import { PresentableError } from '../../lib/error';

export interface GetUserRes {
	error: Omit<PresentableError, 'name'> | null;
	user: DbUserRes | null;
}

export interface UpdateUserReq {
	uuid: string;
	user: Partial<UpdatableUserProps>;
}

export type UpdatableUserProps = Pick<
	DbUserRes,
	'address' | 'preferences' | 'schedule'
>;
