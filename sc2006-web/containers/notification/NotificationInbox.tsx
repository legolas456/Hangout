import react, { useState, useEffect } from 'react';
import { Tooltip, Divider } from 'antd';
import { NotificationBell } from '../../components/common';
import { DbNotificationRes } from '../../types';
import { notificationService } from '../../services';
import { useNotification } from '../../hooks';
import moment from 'moment';

interface NotificationInboxProps {
	uuids: string[];
}

export const NotificationInbox = ({ uuids }: NotificationInboxProps) => {
	const notification = useNotification();
	const [notifications, setNotifications] = useState<DbNotificationRes[]>([]);
	const [isInboxOpen, setIsInboxOpen] = useState(false);
	const [newCount, setNewCount] = useState(0);

	useEffect(() => {
		const populateInbox = async () => {
			try {
				const notificationResult =
					await notificationService.getUserNotifications({
						notificationUuids: uuids,
					});
				notificationResult.sort((n1, n2) => {
					const m1 = moment(n1.createdAt);
					const m2 = moment(n2.createdAt);
					return m1.isBefore(m2) ? 1 : -1;
				});
				setNotifications(notificationResult);
				const unseenCount = notificationResult.reduce(
					(previousValue: number, nextNotification: DbNotificationRes) =>
						nextNotification.seenAt !== null
							? previousValue
							: previousValue + 1,
					0,
				);
				setNewCount(unseenCount);
			} catch (e: any) {
				notification.apiError(e);
			}
		};
		if (uuids && uuids.length) {
			populateInbox();
		}
	}, [uuids]);

	const onClickInbox = async () => {
		const markNewNotificationsAsSeen = async () => {
			const unseenNotifications = notifications.filter(
				(notification) => notification.seenAt === null,
			);

			if (unseenNotifications.length > 0) {
				const uuids = unseenNotifications.map(
					(notification) => notification.uuid,
				);
				await notificationService.markAllAsSeen({
					notificationUuids: uuids,
				});
			}
		};
		try {
			setIsInboxOpen((wasInboxOpen) => {
				// If there are unseen notifications, we will set them as seen once inbox is opened
				if (newCount != 0) {
					// mark as seen when inbox is opened
					if (!wasInboxOpen) {
						markNewNotificationsAsSeen();
					} else {
						setNotifications((prevNotifications) => {
							return prevNotifications.map((notification) => ({
								...notification,
								seenAt: new Date(),
							}));
						});
						setNewCount(0);
					}
				}
				return !wasInboxOpen;
			});
		} catch (e: any) {
			notification.apiError(e);
		}
	};

	return (
		<div className="flex flex-row justify-center items-center px-5">
			<Tooltip
				className="w-full"
				placement="bottom"
				color="white"
				open={isInboxOpen}
				trigger="click"
				onOpenChange={(visible) => setIsInboxOpen(visible)}
				overlayInnerStyle={{ padding: 0 }}
				title={
					<div className="w-60" style={{ height: '25rem' }}>
						<div className="grid grid-cols-1 overflow-y-auto h-full">
							{notifications.map(({ title, description, seenAt, uuid }) => {
								return seenAt ? (
									<react.Fragment key={uuid}>
										<div className="text-black  p-4 text-left space-y-1">
											<b className="text-sm">{title}</b>
											<p className="text-sm">{description}</p>
										</div>
										<Divider
											className="bg-sky-400"
											style={{ margin: 0 }}
										></Divider>
									</react.Fragment>
								) : (
									<react.Fragment key={uuid}>
										<button className="text-black  bg-emerald-50 p-4 text-left space-y-1">
											<b className="text-base">{title}</b>
											<p className="text-sm">{description}</p>
										</button>
										<Divider style={{ margin: 0, width: '80%' }}></Divider>
									</react.Fragment>
								);
							})}
						</div>
					</div>
				}
			>
				<div className="flex flex-row justify-center items-center">
					<NotificationBell
						onClick={onClickInbox}
						isClicked={isInboxOpen}
						count={newCount}
					/>
				</div>
			</Tooltip>
		</div>
	);
};
