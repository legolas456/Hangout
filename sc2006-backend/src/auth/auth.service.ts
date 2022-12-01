import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt'); // eslint-disable-line
import { AuthUserDto } from './auth-user.dto';
import { ValidateUserOutcome, TokenInput } from '../constants/auth';
import {
	PresentableError,
	defaultApiErrMessage,
	DbUserRes,
} from '../../../sc2006-common/src';

export interface DecodeTokenUser {
	user: Omit<DbUserRes, 'password' | 'createdAt'>;
}

export interface DecodeTokenError {
	error: string;
}

export type DecodeTokenResult = DecodeTokenError | DecodeTokenUser;
@Injectable()
export class AuthService {
	private readonly saltRounds = 10;
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private logger: Logger,
	) {}

	async signup({
		username,
		password,
	}: AuthUserDto): Promise<{ error?: Omit<PresentableError, 'name'> }> {
		try {
			const storedUser = await this.userService.findOne(username);
			if (storedUser) {
				throw new Error('User already exists');
			}
			const hashedPassword = await bcrypt.hash(password, this.saltRounds);
			await this.userService.create({
				username: username,
				password: hashedPassword,
			});
			return { error: null };
		} catch (e) {
			this.logger.warn(e.message, 'AuthService');
			return {
				error: {
					message: 'Email is already in use.',
					title: 'Sign up error',
					level: 'error',
				},
			};
		}
	}

	async signToken(
		outcome: ValidateUserOutcome,
	): Promise<ValidateUserOutcome & { access_token: string | null }> {
		try {
			const { user, error } = outcome;
			const tokenInput: TokenInput = {
				username: user.uuid,
				createdAt: user.createdAt,
			};
			let access_token = null;
			if (!error) {
				access_token = this.jwtService.sign(tokenInput);
			}
			return { access_token };
		} catch (e) {
			this.logger.warn(`Signing token failed: ${e.message}`, 'AuthService');
		}
	}

	async decodeToken(token: string): Promise<DecodeTokenResult> {
		try {
			const decoded = this.jwtService.decode(token) as TokenInput;
			const { username } = decoded;
			const user = await this.userService.findOne(username);
			if (!user) {
				throw new Error('User could not be found from decoded token');
			}
			const { password, createdAt, ...rest } = user;

			return { user: rest };
		} catch (e) {
			this.logger.warn(`Decoding token failed: ${e.message}`, 'AuthService');
			return { error: defaultApiErrMessage };
		}
	}

	async login(
		username: string,
		inputPassword: string,
	): Promise<ValidateUserOutcome> {
		try {
			const user = await this.userService.findOne(username);
			if (!user) {
				throw new Error(`User ${username} not found`);
			}
			const response: boolean = await bcrypt.compare(
				inputPassword,
				user.password,
			);
			if (!response) {
				throw new Error('Invalid password');
			}
			const { password, ...rest } = user;

			return { user: rest };
		} catch (e) {
			this.logger.warn(`User login failed: ${e.message}`, 'AuthService');
			return { error: e.message };
		}
	}

	/* 
    Promise.all takes iterable of promises, and returns a single promise.
  */
	async hashPasswords(users: { password: string }[]): Promise<string[]> {
		return Promise.all(
			users.map(async (user) => {
				return await bcrypt.hash(user.password, 10);
			}),
		);
	}
}
