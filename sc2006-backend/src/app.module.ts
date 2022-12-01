import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SeedDataService } from './seed-data/seed-data.service';
import { SeedDataModule } from './seed-data/seed-data.module';
import * as Joi from 'joi';
import { UserController } from './user/user.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';
import { NotificationController } from './notification/notification.controller';
import { EventModule } from './event/event.module';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { EventResultModule } from './event-result/event-result.module';
import { EventResultService } from './event-result/event-result.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from './email/email.module';

/*
  Joi used to define an Object Schema which is compared to Config Object,
  So if for example NODE_ENV which we marked as required is not defined, an error is thrown
*/
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision')
					.required(),
				PORT: Joi.number().required(),
				JWT_SECRET: Joi.string().required(),
				AUTH_TOKEN_EXPIRY_MSEC: Joi.number().required(),
				GEOAPIFY_API_KEY: Joi.string().required(),
			}),
		}),
		ThrottlerModule.forRoot({
			ttl: 30,
			limit: 10,
		}),
		AuthModule,
		UserModule,
		SeedDataModule,
		NotificationModule,
		EventModule,
		EventResultModule,
		EmailModule,
	],
	controllers: [
		AppController,
		AuthController,
		UserController,
		NotificationController,
		EventController,
	],
	providers: [
		AppService,
		Logger,
		SeedDataService,
		NotificationService,
		EventService,
		EventResultService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
