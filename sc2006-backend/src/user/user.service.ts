import { Injectable, Logger } from '@nestjs/common';
import { db } from 'src/firebase.config';
import {
	doc,
	getDoc,
	query,
	serverTimestamp,
	setDoc,
	Timestamp,
	WriteBatch,
	writeBatch,
	collection,
	where,
	getDocs,
	documentId,
	updateDoc,
} from 'firebase/firestore';
import { AuthUserDto } from 'src/auth/auth-user.dto';
import {
	API_DATETIME_FORMAT,
	DbUser,
	DbUserRes,
	PresentableError,
} from '../../../sc2006-common/src';
import * as moment from 'moment';

@Injectable()
export class UserService {
	constructor(private readonly logger: Logger) {}

	/*
    Returns User document if found, else undefined
  */
	async findOne(
		_username: string,
	): Promise<(DbUserRes & { uuid: string }) | undefined> {
		const docRef = doc(db, 'users', _username);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return undefined;
		}
		const { createdAt, ...rest } = docSnap.data() as DbUser;
		return {
			uuid: docSnap.id,
			...rest,
			createdAt: createdAt.toDate(),
		};
	}

	async updateOne(
		uuid: string,
		user: Partial<DbUserRes>,
	): Promise<Omit<PresentableError, 'name'> | null> {
		try {
			const docRef = doc(db, 'users', uuid);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				throw new Error(`User ${uuid} does not exist`);
			}
			await updateDoc(docRef, {
				...user,
				updatedAt: moment().format(API_DATETIME_FORMAT),
			});
			return null;
		} catch (e) {
			this.logger.error(e.message, 'userService');
			return {
				title: 'Failed to update user',
				message: e.message,
				level: 'error',
			};
		}
	}

	async create({ username, password }: AuthUserDto) {
		try {
			const docRef = doc(db, 'users', username);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				throw new Error('User already exists');
			}
			const dbUser: Omit<DbUser, 'username'> = {
				password,
				createdAt: serverTimestamp() as Timestamp,
				eventIds: [],
				preferences: [],
				schedule: {},
				notificationIds: [],
				address: null,
				friendIds: [],
				updatedAt: moment().format(API_DATETIME_FORMAT),
			};
			await setDoc(doc(db, 'users', username), dbUser);
			this.logger.log(`User ${username} created`, 'UserService');
		} catch (e) {
			this.logger.warn(`Unable to create User: ${e.message}`, 'UserService');
			throw e;
		}
	}

	async bulkCreate(
		users: Array<
			Omit<DbUser, 'createdAt' | 'updatedAt'> & { username: string }
		>,
		existingBatch?: WriteBatch,
	) {
		const batch = existingBatch ? existingBatch : writeBatch(db);
		try {
			users.forEach(({ username, ...rest }) => {
				const user: DbUser = {
					...rest,
					updatedAt: moment().format(API_DATETIME_FORMAT),
					createdAt: serverTimestamp() as Timestamp,
				};
				const newUserDocRef = doc(db, 'users', username);
				batch.set(newUserDocRef, user);
			});
			if (!existingBatch) {
				await batch.commit();
			}
			return { error: null };
		} catch (e) {
			this.logger.warn(
				`Could not batch write users: ${e.message}`,
				'UserService',
			);
		}
	}

	async bulkFindAllById(uuids: string[]): Promise<DbUserRes[]> {
		try {
			const usersRef = collection(db, 'users');
			const qry = query(usersRef, where(documentId(), 'in', uuids));
			const res = [];
			const querySnapshot = await getDocs(qry);
			querySnapshot.forEach((q) => res.push(q.data()));
			return res as unknown as DbUserRes[];
		} catch (e) {
			this.logger.warn(
				`Could not batch find users: ${e.message}`,
				'UserService',
			);
		}
	}

	async bulkUpdate(
		{ uuids, users }: { uuids: string[]; users: Partial<DbUserRes>[] },
		existingBatch?: WriteBatch,
	) {
		const batch = existingBatch ? existingBatch : writeBatch(db);
		try {
			if (uuids.length !== users.length) {
				throw new Error('uuids and users must be of the same length');
			}
			uuids.forEach((uuid, index) => {
				const docRef = doc(db, 'users', uuid);
				batch.update(docRef, {
					...users[index],
					updatedAt: moment().format(API_DATETIME_FORMAT),
				});
			});
			if (!existingBatch) {
				await batch.commit();
			}
		} catch (e) {
			this.logger.error(e.message, 'UserService');
			throw e;
		}
	}
}
