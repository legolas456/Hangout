import { createContext, Dispatch } from 'react';
import { UserRes } from '../types';
export type Me = UserRes;

export interface GlobalContextProps {
	wasLoggedIn: boolean;
	setWasLoggedIn: (value: boolean) => void;
	me?: Me;
	setMe: Dispatch<React.SetStateAction<Me | undefined>>;
	postLoginPath: string;
	setPostLoginPath: (path: string) => void;
}

export const GlobalContext = createContext<GlobalContextProps>(
	undefined as any,
);
