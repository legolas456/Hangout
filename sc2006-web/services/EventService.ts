import { throwErrorOrGetData } from '../lib/error';
import {
	CreateEventReq,
	CreateEventRes,
	DbEventResultRes,
	DetailedEventRes,
	ListBriefEventRes,
	ListEventsReq,
	UpdateEventReq,
} from '../types';

export class EventService {
	async create(req: CreateEventReq) {
		const response = await fetch(`${process.env.API_URL}/events/create`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		const data = await throwErrorOrGetData<CreateEventRes>(response, {
			fallbackMessage:
				'Please check your inputs. Otherwise please try again later or send us an alert',
			fallbackTitle: 'Failed to create event',
		});
		return data;
	}

	async generateEventResult(req: CreateEventReq) {
		const response = await fetch(`${process.env.API_URL}/events/demo/create`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		const data = await throwErrorOrGetData<
			DbEventResultRes & { proposedDate: string }
		>(response, {
			fallbackMessage:
				'Please check your inputs. Otherwise please try again later or send us an alert',
			fallbackTitle: 'Failed to create event',
		});
		return data;
	}

	async updateResult(req: UpdateEventReq) {
		const response = await fetch(`${process.env.API_URL}/events/update`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		const data = await throwErrorOrGetData<CreateEventRes>(response, {
			fallbackMessage:
				'Please check your inputs. Otherwise please try again later or send us an alert',
			fallbackTitle: 'Failed to create event',
		});
		return data;
	}

	async getBriefEvents(req: ListEventsReq) {
		const response = await fetch(`${process.env.API_URL}/events/brief/list`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		const data = await throwErrorOrGetData<ListBriefEventRes>(response, {
			fallbackMessage: 'Please try again later or alert us',
			fallbackTitle: 'Failed to retrieve events',
		});
		return data;
	}

	async getBriefMonthEvents(req: ListEventsReq) {
		const response = await fetch(
			`${process.env.API_URL}/events/brief/list/month`,
			{
				method: 'POST', // *GET, POST, PUT, DELETE, etc.
				mode: 'cors', // no-cors, *cors, same-origin
				cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(req),
			},
		);
		const data = await throwErrorOrGetData<ListBriefEventRes>(response, {
			fallbackMessage: 'Please try again later or alert us',
			fallbackTitle: 'Failed to retrieve events',
		});
		return data;
	}

	async getDetailedEvent(req: { uuid: string }) {
		const response = await fetch(`${process.env.API_URL}/events/detailed/one`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
		});
		const data = await throwErrorOrGetData<DetailedEventRes>(response, {
			fallbackMessage:
				'Please check your inputs. Otherwise please try again later or send us an alert',
			fallbackTitle: 'Failed to create event',
		});
		return data;
	}
}
