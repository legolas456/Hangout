import React, { useMemo, ReactNode } from 'react';
import { DbEventRes } from '../../../types';
import { EventCard } from './EventCard';

interface EventSectionProps {
	events: DbEventRes[];
}

export const EventSection = React.memo(function _EventSection({
	events,
}: EventSectionProps) {
	return (
		<div className="flex flex-wrap flex-row gap-x-12 gap-y-12 justify-center p-8">
			{events &&
				events.map((event) => <EventCard key={event.uuid} event={event} />)}
			<div className="basis-5/12 flex-grow"></div>
		</div>
	);
});
