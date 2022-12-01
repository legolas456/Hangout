import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { db } from 'src/firebase.config';
const bcrypt = require('bcrypt'); // eslint-disable-line
import { WriteBatch, writeBatch } from 'firebase/firestore';
import { DbUser } from '../../../sc2006-common/src';

@Injectable()
export class SeedDataService {
	private readonly emails: string[];
	private readonly batch: WriteBatch;
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly logger: Logger,
		private readonly notificationService: NotificationService,
	) {
		this.emails = [
			'wesleylim.work@gmail.com',
			'anais.lengoc@gmail.com',
			'gpalanca10@gmail.com',
			'jeda1998@gmail.com',
			'lerlianping@hotmail.com',
			'sufyanjais1@gmail.com',
		];
		this.batch = writeBatch(db);
	}

	async seedData() {
		try {
			const notificationUuids = await this.seedNotifications();
			const users = await this.seedUsers(notificationUuids);
			await this.batch.commit();
			this.logger.log('Data seeded: SUCCESS', 'AppService');
		} catch (e) {
			this.logger.log(`Data seeded: FAILURE - ${e.message}`, 'AppService');
		}
	}

	private async seedNotifications(): Promise<Array<string[]>> {
		const notificationBatch = this.emails.map((userEmail) => {
			const friendEmails = this.emails.filter((email) => email !== userEmail);
			return friendEmails.map((email) => ({
				title: `${email} has accepted your friend request`,
				description: `You can now add him to your events!`,
			}));
		});

		const notificationUuids = await Promise.all(
			notificationBatch.map(
				async (userNotification) =>
					await this.notificationService.bulkCreate(
						userNotification,
						this.batch,
					),
			),
		);

		return notificationUuids;
	}

	private async seedUsers(notificationIds: Array<string[]>) {
		const users: (Omit<DbUser, 'createdAt' | 'updatedAt'> & {
			username: string;
		})[] = this.emails.map((email, index) => ({
			username: email,
			password: 'password',
			preferences: ['catering.cafe'],
			eventIds: [],
			schedule: {},
			notificationIds: [],
			address: '163009',
			friendIds: this.emails.filter((otherEmail) => otherEmail !== email),
		}));
		const passwords = await this.authService.hashPasswords(users);
		const hashedUsers = passwords.map((hash, index) => ({
			...users[index],
			password: hash as string,
		}));
		await this.userService.bulkCreate(hashedUsers, this.batch);
	}
}
