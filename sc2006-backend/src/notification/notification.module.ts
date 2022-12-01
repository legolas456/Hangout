import { Logger, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
	providers: [NotificationService, Logger],
	exports: [NotificationService],
	controllers: [NotificationController],
})
export class NotificationModule {}
