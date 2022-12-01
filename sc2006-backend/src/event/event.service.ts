import { Injectable, Logger } from '@nestjs/common';
import {
	DbNotification,
	DbEvent,
	DbEventRes,
	EVENT_DATETIME_FORMAT,
	AuthEventParticipant,
	DbUser,
	API_DATETIME_FORMAT,
} from '../../../sc2006-common/src';
import { db } from 'src/firebase.config';
import {
	doc,
	getDoc,
	serverTimestamp,
	Timestamp,
	writeBatch,
	collection,
	query,
	where,
	getDocs,
	documentId,
	arrayUnion,
	WriteBatch,
	DocumentReference,
} from 'firebase/firestore';
import * as moment from 'moment';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class EventService {
	constructor(
		private readonly logger: Logger,
		private readonly notificationService: NotificationService,
	) {}

	async createOne(
		event: Omit<
			DbEvent,
			| 'createdAt'
			| 'sourceDataUpdatedAt'
			| 'resultGeneratedAt'
			| 'eventResultIds'
		>,
	): Promise<{ eventUuid: string }> {
		try {
			const batch = writeBatch(db);
			const { creatorId } = event;
			const now = moment().format(API_DATETIME_FORMAT);
			const newEvent: DbEvent = {
				createdAt: serverTimestamp() as Timestamp,
				sourceDataUpdatedAt: now,
				resultGeneratedAt: now,
				...event,
				creatorId,
			};

			const { uuid } = await this.notificationService.createOne({
				title: `You have been added to event ${event.name}`,
				description: `${creatorId} has added you as a participant on ${moment().format(
					EVENT_DATETIME_FORMAT,
				)}`,
			});

			const newEventDocRef = doc(collection(db, 'events'));
			const creatorDocRef = doc(db, 'users', creatorId);
			const eventUuid = newEventDocRef.id;

			const authParticipantIds = event.participants.filter(
				(p) => 'uuid' in p,
			) as AuthEventParticipant[];

			authParticipantIds.forEach((participant) => {
				const authParticipantDocRef = doc(db, 'users', participant.uuid);
				const updatedParticipant: Partial<DbUser> = {
					eventIds: arrayUnion(eventUuid) as any,
					notificationIds: arrayUnion(uuid) as any,
				};
				batch.update(authParticipantDocRef, updatedParticipant);
			});

			batch.set(newEventDocRef, newEvent);
			batch.update(creatorDocRef, {
				eventIds: arrayUnion(eventUuid),
			});

			await batch.commit();

			this.logger.log(
				`Event ${eventUuid} created by ${creatorId}`,
				'EventService',
			);
			return { eventUuid };
		} catch (e) {
			this.logger.warn(`Unable to create event: ${e.message}`, 'EventService');
			throw e;
		}
	}

	async updateOne(event: Partial<DbEvent> & { uuid: string }) {
		const batch = writeBatch(db);
		const { uuid, ...rest } = event;
		const eventDocRef = doc(db, 'events', uuid);

		const notification = await this.notificationService.createOne({
			title: `Event ${event.name} has been updated`,
			description: `${event.name} was updated on ${moment().format(
				EVENT_DATETIME_FORMAT,
			)}`,
		});

		const authParticipantIds = event.participants.filter(
			(p) => 'uuid' in p,
		) as AuthEventParticipant[];

		authParticipantIds.forEach((participant) => {
			const authParticipantDocRef = doc(db, 'users', participant.uuid);
			const updatedParticipant: Partial<DbUser> = {
				notificationIds: arrayUnion(notification.uuid) as any,
			};
			batch.update(authParticipantDocRef, updatedParticipant);
		});
		const now = moment().format(API_DATETIME_FORMAT);
		batch.update(eventDocRef, {
			...rest,
			resultGeneratedAt: now,
			sourceDataUpdatedAt: now,
		});
		await batch.commit();
	}

	async findOne(uuid: string): Promise<DbEventRes | undefined> {
		const docRef = doc(db, 'events', uuid);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return undefined;
		}

		const { createdAt, ...rest } = docSnap.data() as Omit<DbEvent, 'uuid'>;
		return {
			uuid: docSnap.id,
			...rest,
			createdAt: moment(createdAt.toDate()).format(EVENT_DATETIME_FORMAT),
		};
	}

	async findMany(uuids: string[]) {
		const eventsRef = collection(db, 'events');
		const docRefs = uuids.map((uuid) => doc(db, 'events', uuid));
		// firebase 'in' filter limits array to a length of 10, so we group them in batches of 10
		const batchedDocRefs: DocumentReference[][] = [];
		docRefs.forEach((ref, index) => {
			if (index % 10 == 0) {
				batchedDocRefs.push([ref]);
			} else {
				batchedDocRefs[Math.floor(index / 10)].push(ref);
			}
		});

		const batchedQuerySnapshots = await Promise.all(
			batchedDocRefs.map(async (docRef) => {
				const qry = query(eventsRef, where(documentId(), 'in', docRef));
				return await getDocs(qry);
			}),
		);

		const result: DbEventRes[] = [];
		batchedQuerySnapshots.forEach((querySnapshotBatch) => {
			querySnapshotBatch.forEach((doc) => {
				const { createdAt, ...rest } = doc.data() as Omit<DbEvent, 'uuid'>;
				result.push({
					uuid: doc.id,
					...rest,
					createdAt: moment(createdAt.toDate()).format(EVENT_DATETIME_FORMAT),
				});
			});
		});

		return result;
	}

	async bulkCreate(
		notifications: Pick<DbNotification, 'title' | 'description'>[],
		existingBatch?: WriteBatch,
	) {
		// Get a new write batch
		const batch = existingBatch ? existingBatch : writeBatch(db);
		const uuids = [];
		try {
			notifications.forEach(({ title, description }) => {
				const newNotificationDocRef = doc(collection(db, 'notifications'));
				uuids.push(newNotificationDocRef.id);

				batch.set(newNotificationDocRef, {
					createdAt: serverTimestamp() as unknown as Date,
					seenAt: null,
					title,
					description,
				});
			});

			if (!existingBatch) {
				await batch.commit();
			}

			return { uuids };
		} catch (e) {
			this.logger.warn(
				`Could not batch write notifications: ${e.message}`,
				'NotificationService',
			);
		}
	}

	async bulkUpdate(
		events: {
			uuid: string;
			newEvent: Partial<DbEvent>;
		}[],
		existingBatch?: WriteBatch,
	) {
		const batch = existingBatch ? existingBatch : writeBatch(db);
		try {
			events.forEach(({ uuid, newEvent }) => {
				const ref = doc(db, 'events', uuid);
				if (newEvent?.participants) {
					const { participants, ...rest } = newEvent;
					batch.set(ref, { participants }, { merge: true });
					if (Object.keys(rest).length) {
						batch.update(ref, {
							...rest,
							sourceDataUpdatedAt: moment().format(API_DATETIME_FORMAT),
						});
					}
				} else {
					batch.update(ref, {
						...newEvent,
						sourceDataUpdatedAt: moment().format(API_DATETIME_FORMAT),
					});
				}
			});

			if (!existingBatch) {
				await batch.commit();
			}
			return { error: null };
		} catch (e) {
			this.logger.warn(
				`Could not batch update notifications: ${e.message}`,
				'NotificationService',
			);
		}
	}
}
