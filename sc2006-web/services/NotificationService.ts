import { DbNotificationRes } from '../types';
import { throwErrorOrGetData } from '../lib/error';

export class NotificationService {
	async getUserNotifications(req: { notificationUuids: string[] }) {
		const response = await fetch(`${process.env.API_URL}/notifications/list`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
			credentials: 'include',
		});

		const data = await throwErrorOrGetData<DbNotificationRes[]>(response, {
			fallbackMessage: 'Please try again later or send us an alert',
			fallbackTitle: 'Error fetching notifications',
		});
		return data;
	}

	async markAllAsSeen(req: { notificationUuids: string[] }) {
		const response = await fetch(
			`${process.env.API_URL}/notifications/markAsSeen`,
			{
				method: 'POST', // *GET, POST, PUT, DELETE, etc.
				mode: 'cors', // no-cors, *cors, same-origin
				cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(req),
				credentials: 'include',
			},
		);

		await throwErrorOrGetData<DbNotificationRes[]>(response, {
			fallbackMessage: 'Please try again later or send us an alert',
			fallbackTitle: 'Error fetching notifications',
		});
	}
}
