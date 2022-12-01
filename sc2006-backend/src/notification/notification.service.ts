import { Injectable, Logger } from '@nestjs/common';
import { DbNotification, DbNotificationRes } from '../../../sc2006-common/src';
import { db } from 'src/firebase.config';
import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	Timestamp,
	writeBatch,
	collection,
	query,
	where,
	getDocs,
	documentId,
	WriteBatch,
	DocumentReference,
} from 'firebase/firestore';

@Injectable()
export class NotificationService {
	constructor(private readonly logger: Logger) {}
	async createOne({
		title,
		description,
	}: Pick<DbNotification, 'title' | 'description'>): Promise<{ uuid: string }> {
		try {
			const notification: Omit<DbNotification, 'uuid'> = {
				createdAt: serverTimestamp() as Timestamp,
				seenAt: null,
				title,
				description,
			};
			const newNotificationDocRef = doc(collection(db, 'notifications'));
			await setDoc(newNotificationDocRef, notification);

			const uuid = newNotificationDocRef.id;
			this.logger.log(`Notification ${uuid} created`, 'NotificationService');
			return { uuid };
		} catch (e) {
			this.logger.warn(
				`Unable to create Notification: ${e.message}`,
				'NotificationService',
			);
			throw e;
		}
	}

	async findOne(uuid: string): Promise<DbNotificationRes | undefined> {
		const docRef = doc(db, 'notifications', uuid);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return undefined;
		}
		return {
			uuid: docSnap.id,
			...(docSnap.data() as Omit<DbNotificationRes, 'uuid'>),
		};
	}

	async findMany(uuids: string[]) {
		const notificationsRef = collection(db, 'notifications');
		const docRefs = uuids.map((uuid) => doc(db, 'notifications', uuid));

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
				const qry = query(notificationsRef, where(documentId(), 'in', docRef));
				return await getDocs(qry);
			}),
		);

		// const qry = query(notificationsRef, where(documentId(), 'in', docRefs));
		// const querySnapshot = await getDocs(qry);
		const result: DbNotificationRes[] = [];
		batchedQuerySnapshots.forEach((querySnapshotBatch) => {
			querySnapshotBatch.forEach((doc) => {
				const { createdAt, seenAt, ...rest } = doc.data() as Omit<
					DbNotification,
					'uuid'
				>;
				result.push({
					uuid: doc.id,
					createdAt: createdAt.toDate(),
					seenAt: seenAt ? seenAt.toDate() : null,
					...rest,
				});
			});
		});

		return result;
	}

	async bulkCreate(
		notifications: Pick<DbNotification, 'title' | 'description'>[],
		existingBatch?: WriteBatch,
	) {
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
			return uuids;
		} catch (e) {
			this.logger.warn(
				`Could not batch write notifications: ${e.message}`,
				'NotificationService',
			);
		}
	}

	async bulkUpdate(
		notifications: {
			uuid: string;
			updatedNotification: Partial<DbNotification>;
		}[],
		existingBatch?: WriteBatch,
	) {
		const batch = existingBatch ? existingBatch : writeBatch(db);
		try {
			notifications.forEach(({ uuid, updatedNotification }) => {
				const ref = doc(db, 'notifications', uuid);
				batch.update(ref, updatedNotification);
			});

			if (!existingBatch) {
				await batch.commit();
			}
			return { error: null };
		} catch (e) {
			this.logger.warn(
				'Could not batch update notifications',
				'NotificationService',
			);
		}
	}
}
