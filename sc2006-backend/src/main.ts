import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
	WinstonModule,
	utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: {
			origin: true,
			credentials: true,
		},
	});
	app.use(cookieParser());
	/*
    This applies input validation on all routes
  */
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	app.useLogger(
		WinstonModule.createLogger({
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.ms(),
						nestWinstonModuleUtilities.format.nestLike('Hangout Ideas', {
							// options
						}),
					),
				}),
				// other transports...
			],
			// other options
		}),
	);
	await app.listen(process.env.PORT || 3100);
}
bootstrap();
