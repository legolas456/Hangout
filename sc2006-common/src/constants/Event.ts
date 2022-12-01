import { Timestamp } from 'firebase/firestore';
import { CreateEventReq } from '../api-models';
import { DbEventResultRes } from './EventResult';
import { DbUserRes } from './User';

export interface DbEvent extends CreateEventReq {
	creatorId: string;
	createdAt: Timestamp;
	sourceDataUpdatedAt: string; // when a participant updates his profile, the result that was generated is outdated so we should indicate this.
	resultGeneratedAt: string;
	eventResultId: string;
	expiresAt: string;
	proposedDate: string;
}

export interface DbEventRes extends Omit<DbEvent, 'createdAt'> {
	uuid: string;
	createdAt: string;
}

export type DetailedEventRes = Omit<DbEventRes, 'eventResultId'> & {
	eventResult: DbEventResultRes;
};

export type PublicEventParticipant = Pick<
	DbUserRes,
	'preferences' | 'schedule'
> & {
	address: string;
	isCreator: boolean;
	name: string;
};

export interface AuthEventParticipant extends PublicEventParticipant {
	uuid: string;
}

export type EventParticipant = PublicEventParticipant | AuthEventParticipant;
