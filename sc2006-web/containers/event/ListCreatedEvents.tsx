import React, { useMemo, RefObject } from 'react';
import { Card } from '../../components/common';
import { DbEventRes } from '../../types';
import { EventSection } from './EventSection';
import moment from 'moment';

interface ListCreatedEventsProps {
	events: Array<DbEventRes>;
}

export const ListCreatedEvents = React.memo(function _ListCreatedEvents({
	events,
}: ListCreatedEventsProps) {
	const activeEvents = useMemo(() => {
		const now = moment();
		return events.filter((e) => now.isSameOrBefore(e.expiresAt));
	}, [events.length]);

	const expiredEvents = useMemo(() => {
		const now = moment();
		return events.filter((e) => now.isAfter(e.expiresAt));
	}, [events.length]);

	return (
		<div className="flex flex-col p-12">
			<h1 className="text-2xl mb-4">Created Events</h1>
			<EventSection events={activeEvents} />
			<EventSection events={expiredEvents} />
		</div>
	);
});
