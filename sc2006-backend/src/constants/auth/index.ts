import { PresentableError, UserRes } from '../../../../sc2006-common/src';

export interface ValidateUserOutcome {
	user?: UserRes;
	error?: PresentableError;
}

export interface TokenInput {
	username: string;
	createdAt: Date;
}

export interface GetUserFromTokenReq {
	username?: string;
}
