import { useRouter } from 'next/router';
import { useEffect, ReactNode, useState, useContext } from 'react';
import { Spin } from '../../components/common';
import { PageTransitionContext } from '../../contexts';
import { useProtectRoutes } from '../../hooks';
import { NAVIGATION_HEIGHT } from '../../constants';

interface PageTransitionWrapperProps {
	children: ReactNode;
}

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
	children,
}) => {
	const router = useRouter();
	const { loading } = useContext(PageTransitionContext);
	const [internalLoading, setInternalLoading] = useState(false);
	useProtectRoutes();

	useEffect(() => {
		const handleStart = (url: string) =>
			url !== router.asPath && setInternalLoading(true);
		// Removed url === router.asPath as it seems possible that url !== asPath
		const handleEnd = () => setInternalLoading(false);

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleEnd);
		router.events.on('routeChangeError', handleEnd);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleEnd);
			router.events.off('routeChangeError', handleEnd);
		};
	});

	return (
		<div
			className="flex flex-row items-center justify-center min-w-screen min-h-screen"
			style={{ marginTop: NAVIGATION_HEIGHT }}
		>
			{children}
			{(loading || internalLoading) && (
				<div
					className="bg-white w-screen h-screen"
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: 999,
						width: '100vw',
						height: '100vh',
						marginTop: NAVIGATION_HEIGHT,
					}}
				>
					<Spin
						size="large"
						center
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
						}}
					/>
				</div>
			)}
		</div>
	);
};
