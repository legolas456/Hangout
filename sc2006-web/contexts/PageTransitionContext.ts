/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch } from 'react';

export interface PageTransitionContextProps {
	loading: boolean;
	setLoading: Dispatch<boolean>;
}

export const PageTransitionContext = createContext<PageTransitionContextProps>({
	loading: false,
	setLoading: () => {},
});
