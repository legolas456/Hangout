import { Logger, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';
import { EventResultModule } from 'src/event-result/event-result.module';
import { EventResultService } from 'src/event-result/event-result.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';

@Module({
	imports: [
		AuthModule,
		UserModule,
		JwtModule,
		NotificationModule,
		EventResultModule,
		EmailModule,
	],
	providers: [
		EventService,
		Logger,
		AuthService,
		UserService,
		EventResultService,
		EmailService,
	],
	controllers: [EventController],
})
export class EventModule {}
