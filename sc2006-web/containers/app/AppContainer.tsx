import { Layout as AntdLayout } from 'antd';
import React from 'react';
import { MenuBar, PageTransitionWrapper } from '.';
import {
	GlobalContextProps,
	GlobalContext,
	PageTransitionContext,
	PageTransitionContextProps,
} from '../../contexts/';
import { NotificationContainer } from '../notification';

interface AppContainerProps {
	children: React.ReactNode;
	meContext: GlobalContextProps;
	pageTransitionContext: PageTransitionContextProps;
}

export const AppContainer: React.FC<AppContainerProps> = ({
	children,
	meContext,
	pageTransitionContext,
}) => {
	return (
		<AntdLayout
			className="w-screen h-screen relative"
			style={{ background: 'none' }}
		>
			<GlobalContext.Provider value={meContext}>
				<NotificationContainer>
					<MenuBar />
					<PageTransitionContext.Provider value={pageTransitionContext}>
						<PageTransitionWrapper>{children}</PageTransitionWrapper>
					</PageTransitionContext.Provider>
				</NotificationContainer>
			</GlobalContext.Provider>
		</AntdLayout>
	);
};
