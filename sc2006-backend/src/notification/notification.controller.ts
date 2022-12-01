import {
	Controller,
	UseGuards,
	Post,
	Body,
	UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { UpdateNotificationDto } from './update-notification.dto';
import { LoggingInterceptor } from 'src/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('notifications')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(JwtAuthGuard)
	@Post('list')
	async getUserNotifications(@Body() req: UpdateNotificationDto) {
		const notifications = await this.notificationService.findMany(
			req.notificationUuids,
		);
		return notifications;
	}

	@UseGuards(JwtAuthGuard)
	@Post('markAsSeen')
	async markAsSeen(@Body() req: UpdateNotificationDto) {
		const res = await this.notificationService.bulkUpdate(
			req.notificationUuids.map((uuid) => ({
				uuid,
				updatedNotification: {
					seenAt: serverTimestamp() as Timestamp,
				},
			})),
		);
		return res;
	}
}
