/* eslint camelcase:"off", no-useless-constructor: "off", no-mixed-spaces-and-tabs: "off" */

import {
	Controller,
	Post,
	Body,
	UseGuards,
	Get,
	Request,
	UseInterceptors,
	Req,
	Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './auth-user.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { LoginRes } from '../../../sc2006-common';
import { GetUserFromTokenReq } from 'src/constants';

/*
Interceptors are called top-down, i.e. Logging Interceptor runs before ResTransformInterCeptor
*/
@UseInterceptors(LoggingInterceptor)
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/*
    LocalAuthGuard calls ValidateUser which reads the user attached to Body and
    if valid, attaches the User onto Request received by Router
		If you have res as a param you cannot return an object, but instead make use of res
  */
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@Req() req,
		@Res({ passthrough: true }) response,
	): Promise<LoginRes> {
		const { access_token } = await this.authService.signToken(req.user);
		const tokenOptions =
			process.env.NODE_ENV === 'development'
				? {
						path: '/',
						httpOnly: true,
						maxAge: process.env.AUTH_TOKEN_EXPIRY_MSEC,
				  }
				: {
						path: '/',
						httpOnly: true,
						maxAge: process.env.AUTH_TOKEN_EXPIRY_MSEC,
						sameSite: 'none',
						secure: true,
				  };
		response.cookie('jwtToken', access_token, tokenOptions);
		return req.user;
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res) {
		res.cookie('jwtToken', null, {
			httpOnly: true,
		});
		res.status(200);
	}

	@Post('signup')
	signup(@Body() user: AuthUserDto) {
		return this.authService.signup(user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	/* 
		After log in the token is attached to req with an expiry. When a User accesses a protected resource,
		if his token has not expired, extend it's expiry, otherwise reject the request(auto handled by JwtAuthGuard)
	*/
	@UseGuards(JwtAuthGuard)
	@Post('revalidate')
	async revalidate(
		@Request() req,
		@Res() res,
		@Body() body: GetUserFromTokenReq,
	) {
		const access_token = req.cookies['jwtToken'];
		res.cookie('jwtToken', access_token, {
			httpOnly: true,
			maxAge: process.env.AUTH_TOKEN_EXPIRY_MSEC,
		});
		// valid JWT token, but edge case where user is loaded to app state
		if (!body.username) {
			const user = await this.authService.decodeToken(access_token);
			res.json(user);
			return;
		}
		res.status(200).send();
	}

	@UseGuards(JwtAuthGuard)
	@Post('reconstruct-user')
	async reconstructUser(@Request() req, @Res() res) {
		const access_token = req.cookies['jwtToken'];
		let user = null;
		if (access_token) {
			user = await this.authService.decodeToken(access_token);
		}
		res.json(user);
	}
}
