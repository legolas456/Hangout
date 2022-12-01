import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.stategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { NotificationModule } from 'src/notification/notification.module';

/*
  AuthModule is dependent on ConfigModule, but it doesn't know that, so there is a race condition where
  AuthModule is loaded before ConfigModule has finished loading, and process.env.* is not ready yet.
  Thus Need to use registerAsync(instead of register) to ensure that configModule(and its service) has
  been loaded before we get our SECRET
*/
@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: '1d',
				},
			}),
		}),
		NotificationModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, Logger, UserService],
	exports: [AuthService],
})
export class AuthModule {}
