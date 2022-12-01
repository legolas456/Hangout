import { DbEventRes, EventParticipant } from '../constants';

export interface CreateEventRes {
	error: any | null;
	eventUuid: string | null;
}

export interface ListEventsReq {
	eventUuids: string[];
	userUuid: string;
}

export interface ListBriefEventRes {
	active: {
		creator: DbEventRes[];
		participant: DbEventRes[];
	};
	expired: {
		creator: DbEventRes[];
		participant: DbEventRes[];
	};
}

export interface CreateEventReq {
	name: string;
	participants: EventParticipant[];
}

export interface UpdateEventReq {
	uuid: string;
	newEvent: CreateEventReq;
	eventResultId: string;
}

export type EventFilterType = 'month';
