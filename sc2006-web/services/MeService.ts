import { LoginRes, AuthUserReq, DbUser } from '../types';
import { throwErrorOrGetData } from '../lib/error';
import { Me } from '../contexts';

export class MeService {
	async signup(user: AuthUserReq) {
		const response = await fetch(`${process.env.API_URL}/auth/signup`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
			credentials: 'include',
		});
		await throwErrorOrGetData(response, {});
	}

	async login(req: AuthUserReq) {
		const response = await fetch(`${process.env.API_URL}/auth/login`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(req),
			credentials: 'include',
		});
		const data = await throwErrorOrGetData<LoginRes>(response, {
			fallbackMessage:
				'Please check your email and password carefully. Otherwise, please try again later',
			fallbackTitle: 'Login error',
		});
		const { user } = data;
		return user;
	}

	async logout() {
		const response = await fetch(`${process.env.API_URL}/auth/logout`, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
		});
		if (response.status > 204) {
			throw new Error('Logout failed please try again later');
		}
	}

	async revalidate(
		username?: string,
	): Promise<Omit<DbUser, 'password'> & { status: string }> {
		const response = await fetch(`${process.env.API_URL}/auth/revalidate`, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
			}),
		});
		const status = response.status;
		const data = await response.json();
		return { ...data, status };
	}

	async reconstructUser(): Promise<Me> {
		const response = await fetch(
			`${process.env.API_URL}/auth/reconstruct-user`,
			{
				method: 'POST', // *GET, POST, PUT, DELETE, etc.
				mode: 'cors', // no-cors, *cors, same-origin
				cache: 'no-cache', // *default, no-cache, reload, force-cache, only-
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		const data = await throwErrorOrGetData<LoginRes>(response, {});
		return data.user;
	}
}
