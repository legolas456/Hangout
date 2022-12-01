import React, { useState, useLayoutEffect, useContext } from 'react';
import { Divider, Tabs } from 'antd';
import { useRouter } from 'next/router';
import { PlusCircleFilled } from '@ant-design/icons';
import { ListBriefEventRes } from '../../types';
import { GlobalContext, PageTransitionContext } from '../../contexts';
import { eventService } from '../../services';
import { useNotification } from '../../hooks';
import { EventSection } from '../../containers/event/EventSection';

function ListEventsPage() {
	const { me } = useContext(GlobalContext);
	const { setLoading } = useContext(PageTransitionContext);
	const notification = useNotification();
	const [events, setEvents] = useState<ListBriefEventRes>();

	const router = useRouter();

	useLayoutEffect(() => {
		const pullAndSetEvents = async () => {
			setLoading(true);
			try {
				const events = await eventService.getBriefEvents({
					eventUuids: me!.eventIds,
					userUuid: me!.uuid,
				});
				setEvents(events);
			} catch (e) {
				notification.apiError(e);
			}
			setLoading(false);
		};
		if (me) {
			pullAndSetEvents();
		}
	}, [me]);

	const onCreateEvent = () => {
		router.push('/events/create');
	};

	const tabs = [
		{
			label: 'Active',
			key: 'active',
			children: (
				<>
					<EventSection events={events?.active.creator || []} />
					<Divider />
					<EventSection events={events?.active.participant || []} />
				</>
			),
		},
		{
			label: 'Expired',
			key: 'expired',
			children: (
				<>
					<EventSection events={events?.expired.creator || []} />
					<Divider />
					<EventSection events={events?.expired.participant || []} />
				</>
			),
		},
	];
	return (
		<div className="w-full h-full p-12">
			<Tabs items={tabs} />
			<PlusCircleFilled
				style={{
					color: 'rgb(34 211 238)',
					position: 'fixed',
					bottom: 45,
					right: 45,
					fontSize: '4rem',
				}}
				onClick={onCreateEvent}
			/>
		</div>
	);
}

export default ListEventsPage;
