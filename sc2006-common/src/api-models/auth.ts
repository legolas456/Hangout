import { DbUser } from '../constants';

export interface SignUpRes {
	error?: string;
}

export interface LoginRes {
	user?: Omit<DbUser, 'password'>;
	error?: string;
}

export interface AuthUserReq {
	username: string;
	password: string;
}
