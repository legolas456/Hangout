import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/*
  Since we extended PassportStrategy without specifying a name, it defaults to the string
  before '.' in the file name, in this case jwt
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: function (req, res) {
				let jwtToken = null;
				if (req && req.cookies) {
					jwtToken = req.cookies.jwtToken;
				}
				return jwtToken;
			},
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	/*
    Passport first verifies the JWT's signature and decodes the JSON. It then invokes our validate() method
    passing the decoded JSON as its single parameter. Based on the way JWT signing works,
    we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.

    Passport will build a user object based on the return value of our validate() method,
    and attach it as a property on the Request object sent to the Controller
  */
	async validate(payload) {
		return { username: payload.username };
	}
}
