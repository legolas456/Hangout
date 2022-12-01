import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateUserOutcome } from 'src/constants';

/* 
  Since we extended PassportStrategy without specifying a name, it defaults to the string
  before '.' in the file name, in this case local
*/
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService, private logger: Logger) {
		super();
	}

	/*
  Passport will build a user object based on the return value of our validate() method,
  and attach it as a property on the Request object, which will be sent to the Controller
  */
	async validate(
		username: string,
		_password: string,
	): Promise<ValidateUserOutcome> {
		const response = await this.authService.login(username, _password);
		if (response.error) {
			throw new UnauthorizedException(response.error);
		}
		return response;
	}
}
