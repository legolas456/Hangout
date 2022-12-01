import React, {
	ReactNode,
	useContext,
	useEffect,
	useState,
	useMemo,
} from 'react';
import { Menu } from 'antd';
import {
	MenuOutlined,
	LogoutOutlined,
	CalendarOutlined,
	UserOutlined,
	LoginOutlined,
	UserAddOutlined,
	HomeOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Logo } from '.';
import { GlobalContext } from '../../contexts/';
import { meService } from '../../services';
import { useNotification } from '../../hooks';
import { NotificationInbox } from '../notification';
import { NAVIGATION_HEIGHT } from '../../constants';

type MenuItemKey =
	| '/home'
	| '/events'
	| '/profile'
	| '/login'
	| '/logout'
	| '/signup';
interface MenuBarItem {
	label?: ReactNode;
	key: MenuItemKey;
	icon?: ReactNode;
	title?: string;
}

export function MenuBar() {
	const router = useRouter();
	const { me, setMe, setWasLoggedIn } = useContext(GlobalContext);
	const notification = useNotification();

	const ProtectedItems: MenuBarItem[] = useMemo(
		() => [
			{
				label: (
					<div className="flex flex-row items-center justify-center">
						<HomeOutlined className="pr-1" />
						Home
					</div>
				),
				key: '/home',
			},
			{
				label: (
					<div className="flex flex-row items-center justify-center">
						<CalendarOutlined className="pr-1" />
						Events
					</div>
				),
				key: '/events',
			},
			{
				label: (
					<div className="flex flex-row items-center justify-center">
						<UserOutlined className="pr-1" />
						Profile
					</div>
				),
				key: '/profile',
			},
		],
		[],
	);
	const PublicItems: MenuBarItem[] = useMemo(
		() => [
			{
				label: (
					<div className="flex flex-row items-center justify-center">
						<HomeOutlined className="pr-1" />
						Home
					</div>
				),
				key: '/home',
			},
			//getLoginOrSignupButton(router.asPath),
			{
				label: (
					<div className="flex flex-row items-center justify-center">
						<LoginOutlined className="pr-1" />
						Login
					</div>
				),
				key: '/login',
			},
			{
				label: (
					<div className="flex flex-row items-center justify-center">
						<UserAddOutlined className="pr-1" />
						Sign Up
					</div>
				),
				key: '/signup',
			},
		],
		[me, router.asPath],
	);

	const [menuItems, setMenuItems] = useState(PublicItems);

	useEffect(() => {
		setMenuItems(me ? ProtectedItems : PublicItems);
	}, [me, ProtectedItems, PublicItems]);

	const onLogout = async () => {
		await router.push('/home');
		try {
			await meService.logout();
			setMe(undefined);
			setWasLoggedIn(false);

			notification.success('Logged out successfully');
		} catch (e: any) {
			notification.apiError(e);
		}
	};

	return (
		<nav
			className="w-full flex flew-row justify-between bg-white fixed top-0"
			style={{ height: NAVIGATION_HEIGHT, zIndex: 1 }}
		>
			<Logo />
			<div className="w-3/6 flex flex-row justify-end">
				<Menu
					items={menuItems}
					selectedKeys={[router.asPath.split('#')[0]]}
					mode="horizontal"
					className="w-4/5 justify-end"
					expandIcon={<MenuOutlined />}
					onClick={({ key }) => router.push(key)}
					style={{ border: 'none' }}
				/>
				{me && (
					<>
						<NotificationInbox uuids={me.notificationIds} />
						<button
							key="logout"
							onClick={onLogout}
							className="flex justify-start items-center px-5 text-black border-b-3 border-red-500 hover:text-red-500  w-1/5"
						>
							<LogoutOutlined className="pr-1" />
							Logout
						</button>
					</>
				)}
			</div>
		</nav>
	);
}

/* eslint-disable no-mixed-spaces-and-tabs */
function getLoginOrSignupButton(path: string): MenuBarItem {
	return path === '/signup' || path === '/home'
		? {
				label: (
					<div className="flex flex-row items-center justify-center">
						<LoginOutlined className="pr-1" />
						Login
					</div>
				),
				key: '/login',
		  }
		: {
				label: (
					<div className="flex flex-row items-center justify-center">
						<UserAddOutlined className="pr-1" />
						Sign Up
					</div>
				),
				key: '/signup',
		  };
	/* eslint-enable no-mixed-spaces-and-tabs */
}
