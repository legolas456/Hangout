import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { AppContainer } from '../containers/app';
import { Me, GlobalContextProps } from '../contexts/';
import { meService } from '../services';
import { Spin } from '../components/common';
import { PageTransitionContextProps } from '../contexts/PageTransitionContext';
import { useUpdateUser } from '../hooks';

function MyApp({ Component, pageProps }: AppProps) {
	const [me, setMe] = useState<Me | undefined>(undefined as any);
	const [wasLoggedIn, setWasLoggedIn] = useState(false);
	const [isAppLoading, setIsAppLoading] = useState(true);
	const [isPageLoading, setIsPageLoading] = useState(false);
	const [postLoginPath, setPostLoginPath] = useState('/home');

	const globalContext: GlobalContextProps = {
		wasLoggedIn,
		setWasLoggedIn: (bool: boolean) => setWasLoggedIn(bool),
		me: me!,
		setMe: setMe,
		postLoginPath: postLoginPath,
		setPostLoginPath: (path: string) => setPostLoginPath(path),
	};
	const PageTransitionContext: PageTransitionContextProps = {
		loading: isPageLoading,
		setLoading: setIsPageLoading,
	};
	useEffect(() => {
		const reconstructUser = async () => {
			let user;
			try {
				setIsAppLoading(true);
				user = await meService.reconstructUser();
				console.log('reconstructed user', user);
				setMe(user);
			} catch (e) {
				console.log('Could not reconstruct user');
				// No JWT token, so we cannot reconstructUser(401 response)
			}
			setTimeout(() => setIsAppLoading(false), 300);
		};
		reconstructUser();
	}, []);

	useUpdateUser({ me, setMe });

	if (isAppLoading) {
		return (
			<div className="w-screen h-screen flex flex-row justify-center items-center">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<AppContainer
			meContext={globalContext}
			pageTransitionContext={PageTransitionContext}
		>
			<Component {...pageProps} />
		</AppContainer>
	);
}

export default MyApp;
