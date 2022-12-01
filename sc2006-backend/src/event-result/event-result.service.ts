import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
	DbEventResult,
	DbEventResultRes,
	DbEventSuggestion,
	EventParticipant,
	EVENT_DATETIME_FORMAT,
	EVENT_DATE_FORMAT,
	GeoapifyResponse,
	getLatLngCenter,
	PresentableError,
} from '../../../sc2006-common/src';
import fetch from 'node-fetch';
import {
	doc,
	getDoc,
	setDoc,
	collection,
	serverTimestamp,
	Timestamp,
} from 'firebase/firestore';
import { db } from 'src/firebase.config';
import * as moment from 'moment'; // otherwise error moment is not a function

export interface CreateOneResult extends DbEventResult {
	eventResultId?: string;
	expiresAt?: string;
	proposedDate?: string;
}

@Injectable()
export class EventResultService {
	constructor(
		private readonly userService: UserService,
		private readonly logger: Logger,
	) {}

	async findOne(uuid: string): Promise<DbEventResultRes | undefined> {
		const docRef = doc(db, 'event-results', uuid);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return undefined;
		}

		const { createdAt, ...rest } = docSnap.data() as DbEventResult;
		return {
			uuid: docSnap.id,
			createdAt: moment(createdAt.toDate()).format(EVENT_DATETIME_FORMAT),
			...rest,
		};
	}

	async createOne(
		participants: EventParticipant[],
		isDemo = false,
	): Promise<{
		result: CreateOneResult | null;
		error: PresentableError | null;
	}> {
		try {
			const result = await this.getEventResult(participants);
			if (isDemo) return { result, error: null };
			const newResultDocRef = doc(collection(db, 'event-results'));
			await setDoc(newResultDocRef, result);
			this.logger.log(
				`Successfully generated and stored event result ${newResultDocRef.id}`,
				'EventResultService',
			);

			return {
				result: {
					...result,
					eventResultId: newResultDocRef.id,
					expiresAt: moment()
						.add(7, 'day')
						.endOf('day')
						.format(EVENT_DATETIME_FORMAT),
				},
				error: null,
			};
		} catch (e) {
			this.logger.error(
				`Failed to calculate places: ${e.message}
        ${e.stack}`,
				'EventResultService',
			);
			return {
				result: null,
				error: {
					name: '',
					level: 'error',
					title: 'Could not generate Event results',
					message: e.message,
				},
			};
		}
	}

	async updateOne({
		uuid,
		participants,
	}: {
		uuid: string;
		participants: EventParticipant[];
	}): Promise<{
		proposedDate: string | null;
		error: PresentableError | null;
	}> {
		try {
			const result = await this.getEventResult(participants);
			const newResultDocRef = doc(db, 'event-results', uuid);
			await setDoc(newResultDocRef, result);
			this.logger.log(
				`Successfully stored updated event result ${newResultDocRef.id}`,
				'EventResultService',
			);
			console.log('prop', result.proposedDate);
			return {
				proposedDate: result.proposedDate,
				error: null,
			};
		} catch (e) {
			this.logger.error(
				`Failed to calculate places: ${e.message}
        ${e.stack}`,
				'EventResultService',
			);
			return {
				proposedDate: null,
				error: {
					name: '',
					level: 'error',
					title: 'Could not generate Event results',
					message: e.message,
				},
			};
		}
	}

	private async getEventResult(
		participants: EventParticipant[],
	): Promise<DbEventResult & { proposedDate: string }> {
		const commonPreferences = this.getCommonPreferences(participants);
		const center = await this.getCentralLatLng(participants);
		const suggestions = await this.getSuggestedPlaces(
			commonPreferences,
			center,
		);

		const { proposedDate, suggestedDates } =
			this.getSuggestedDates(participants);
		// store result and return uuid of stored result
		return {
			proposedDate,
			suggestedDates,
			suggestions,
			createdAt: serverTimestamp() as Timestamp,
		};
	}

	private getCommonPreferences(participants: EventParticipant[]) {
		const res = [];
		const candidatePreferences = new Set();
		participants.forEach((participant) => {
			const preferences = participant.preferences.length
				? participant.preferences
				: EventResultService.DEFAULT_PREFERENCES;
			preferences.forEach((preference) => {
				if (candidatePreferences.has(preference)) return;
				if (participants.every((p) => p.preferences.includes(preference))) {
					res.push(preference);
				}
				candidatePreferences.add(preference);
			});
		});
		if (res.length < 1) {
			throw new Error('Participants do not have any common preferences');
		}
		return res;
	}

	private async getCentralLatLng(participants: EventParticipant[]) {
		try {
			const geoCodes = await Promise.all(
				participants.map(async ({ address }) => {
					const postal = parseInt(address);
					return await fetch(
						`https://developers.onemap.sg/commonapi/search?searchVal=${postal}&returnGeom=Y&getAddrDetails=N&pageNum=1`,
					).then((response) => response.json());
				}),
			);

			const coordinates: [lat: number, lng: number][] = geoCodes.map(
				(geoCode, index) => {
					if (geoCode.found < 1) {
						throw new Error('One or more postal codes are invalid');
					}
					const { LATITUDE, LONGTITUDE } = geoCode.results[0];
					if (!LATITUDE || !LONGTITUDE) {
						this.logger.warn(
							`Could not find latitude and longtitude for ${JSON.stringify(
								participants[index],
							)}`,
							'EventResultService',
						);
					}
					return [LATITUDE, LONGTITUDE];
				},
			);
			return getLatLngCenter(coordinates);
		} catch (e) {
			console.log(`Error getting central coordinates
			${e.message}
			${e.stack}
			`);
			throw e;
		}
	}

	private async getSuggestedPlaces(
		commonPreferences: string[],
		center: [lat: number, lng: number],
	) {
		/*
			Gets 5 suggested places for each preference in @commonPreferences
			Biased based on distance from the central coordinate from all participants 
		*/

		const presentableCenter = `${center[1]},${center[0]}`; // Geoapify uses [lng,lat] instead of [lat, lng]
		// Since API calculates cost based on number of places returned, we use a separate call for each preference
		const places: GeoapifyResponse[] = await Promise.all(
			commonPreferences.map(async (preference) => {
				return await fetch(
					`https://api.geoapify.com/v2/places?categories=${preference}&bias=proximity:${presentableCenter}&limit=5&apiKey=${process.env.GEOAPIFY_API_KEY}`,
				)
					.then((response) => response.json())
					.catch((e) =>
						console.log(`GeoApify Error
				${e}`),
					);
			}),
		);

		const suggestions: DbEventSuggestion = {};

		places.forEach((place, index) => {
			const preference = commonPreferences[index];
			suggestions[preference] = place.features.map(({ properties }) => {
				const { name, street, formatted, postcode, lat, lon, distance } =
					properties;
				return {
					name: name || street,
					address: formatted,
					postal: postcode,
					coordinates: [lat, lon],
					distanceFromCenter: distance,
				};
			});
		});

		return suggestions;
	}

	private getSuggestedDates(participants: EventParticipant[]) {
		// Calculate intersection of time ranges by getting union of busy times
		const now = moment();
		const busyDateTime = {};
		for (let i = 1; i < 8; i++) {
			const startDateTime = moment()
				.day(now.get('day') + i)
				.startOf('day');
			const endDateTime = moment()
				.day(now.get('day') + i)
				.endOf('day');
			busyDateTime[startDateTime.format(EVENT_DATE_FORMAT)] = new Array(
				24,
			).fill(-1);
		}

		participants.forEach(({ schedule }) => {
			const dates = Object.keys(schedule);
			dates.forEach((date) => {
				const timeRanges = schedule[date];
				timeRanges.forEach((timeRange) => {
					const { start, end } = timeRange;
					const startMoment = moment(start, EVENT_DATETIME_FORMAT);
					const endMoment = moment(end, EVENT_DATETIME_FORMAT);
					const startHour = startMoment.hours();
					const startMinutes = startMoment.minutes();
					const endHour = endMoment.hours();
					const endMinutes = endMoment.minutes();

					for (let h = startHour; h < endHour + 1; h++) {
						if (busyDateTime[date]) {
							const minute = busyDateTime[date][h];
							if (h == startHour) {
								busyDateTime[date][h] =
									minute < 0 ? startMinutes : Math.min(minute, startMinutes);
								busyDateTime;
							} else if (h == endHour) {
								if (endMinutes === 0) {
									continue; // since we have already set h-1 to 59 minutes
								}
								busyDateTime[date][h] =
									minute < 0 ? endMinutes : Math.max(minute, endMinutes);
							} else if (h > startHour && h < endHour) {
								busyDateTime[date][h] = 59;
							}
						}
					}
				});
			});
		});

		// Initialize suggestedDates with {start: 00:00:00, end: 23:59:59}
		const suggestedDates: Record<
			string,
			Array<Record<'start' | 'end', string>>
		> = {};
		for (let i = 1; i < 8; i++) {
			const startDateTime = moment()
				.day(now.get('day') + i)
				.startOf('day');
			const endDateTime = moment()
				.day(now.get('day') + i)
				.endOf('day');
			suggestedDates[startDateTime.format(EVENT_DATE_FORMAT)] = [
				{
					start: startDateTime.format(EVENT_DATETIME_FORMAT),
					end: endDateTime.format(EVENT_DATETIME_FORMAT),
				},
			];
		}

		// Iterate over dates and set the free time intervals
		let maxFreeTime = 0;
		let proposedDate = null;
		Object.keys(busyDateTime).map((dateString) => {
			const hours = busyDateTime[dateString];
			const freeTimes = [];
			let index = 0;
			let freeTime = 0;
			while (index < 24) {
				const start = index;
				while (index < 24 && hours[index] == -1) {
					freeTime++;
					index++;
				}

				const date = moment(dateString, EVENT_DATE_FORMAT);
				if (index > start) {
					const startDate = moment(date).hour(start).startOf('hour');
					const endDate = moment(date)
						.hour(index - 1)
						.endOf('hour');

					freeTimes.push({
						start: startDate.format(EVENT_DATETIME_FORMAT),
						end: endDate.format(EVENT_DATETIME_FORMAT),
					});
				} else {
					index++;
				}
				suggestedDates[dateString] = freeTimes;
			}
			if (freeTime > maxFreeTime) {
				proposedDate = dateString;
				maxFreeTime = freeTime;
			}
		});

		if (!proposedDate)
			throw new Error(
				'No free time range found such that all participants are available',
			);
		return { proposedDate, suggestedDates };
	}

	public static readonly DEFAULT_PREFERENCES = [
		'activity',
		'commercial',
		'catering',
		'entertainment',
		'leisure',
		'natural',
		'national_park',
		'tourism',
		'camping',
		'beach',
		'adults',
	];
}
