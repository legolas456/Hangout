import { UserRes } from '../constants';

export interface SignUpRes {
	error?: string;
}

export interface LoginRes {
	user: UserRes;
}

export interface AuthUserReq {
	username: string;
	password: string;
}
