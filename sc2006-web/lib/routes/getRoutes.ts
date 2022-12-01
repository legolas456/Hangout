export type Routes =
	| '/home'
	| '/login'
	| '/signup'
	| '/events/create'
	| '/events'
	| '/profile';

import { Me } from '../../contexts/GlobalContext';

export function getRoutes(me?: Me) {
	const publicRoutes = {
		'/home': true,
		'/login': true,
		'/signup': true,
		'/events/create': false,
		'/events': false,
		'/profile': false,
	};

	const authRoutes = {
		'/home': true,
		'/login': false,
		'/signup': false,
		'/events/create': true,
		'/events': true,
		'/profile': true,
	};

	const allowedRoutes = me ? authRoutes : publicRoutes;

	return {
		allowedRoutes,
	};
}
