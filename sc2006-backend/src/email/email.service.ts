/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Logger } from '@nestjs/common';

interface CreateEventEmailProps {
	to: string[];
	eventName: string;
	eventCreator: string;
	proposedDate: string;
}

@Injectable()
export class EmailService {
	constructor(private readonly logger: Logger) {}

	async onCreateEvent({
		to,
		eventName,
		eventCreator,
		proposedDate,
	}: CreateEventEmailProps) {
		const sgMail = require('@sendgrid/mail');
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		if (!to.length) {
			this.logger.warn('to-email addresses is empty', 'EmailService');
		}
		const msg = {
			to: ['sc2006.group1@gmail.com', ...to],
			from: 'hangout.sg@outlook.com',
			template_id: process.env.EVENT_CREATED_TEMPLATE_ID,
			dynamicTemplateData: {
				subject: `You have been added to Event: ${eventName}`,
				eventName,
				eventCreator,
				proposedDate,
			},
		};
		sgMail
			.send(msg)
			.then(() => {
				console.log(`Sent emails for created event to ${JSON.stringify(to)}`);
			})
			.catch((error) => {
				console.error('e', error.response.body.errors);
			});
	}

	async onUpdateEvent({
		to,
		eventName,
		eventCreator,
		proposedDate,
	}: CreateEventEmailProps) {
		const sgMail = require('@sendgrid/mail');
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		if (!to.length) {
			this.logger.warn('to-email addresses are empty', 'EmailService');
			return;
		}
		const msg = {
			to: ['sc2006.group1@gmail.com', ...to],
			from: 'hangout.sg@outlook.com',
			template_id: process.env.EVENT_UPDATED_TEMPLATE_ID,
			dynamicTemplateData: {
				subject: `${eventName} has been updated.`,
				eventName,
				eventCreator,
				proposedDate,
			},
		};
		sgMail
			.send(msg)
			.then(() => {
				console.log(`Sent emails for created event to ${JSON.stringify(to)}`);
			})
			.catch((error) => {
				console.error('e', error.response.body.errors);
			});
	}
}
