/* eslint-disable @typescript-eslint/ban-types*/
import React, { useState, useMemo } from 'react';
import { Badge, Calendar } from 'antd';
import moment, { Moment } from 'moment';
import { DbEventRes, EVENT_DATE_FORMAT, ListBriefEventRes } from '../../types';
import { Me } from '../../contexts';

interface ScheduleSectionProps {
	events: ListBriefEventRes['active'];
	me: Me;
}

export const ScheduleSection = React.memo(function _ScheduleModal({
	events,
	me,
}: ScheduleSectionProps) {
	const dateToEventMap = useMemo(() => {
		const res: Record<string, DbEventRes[]> = {};
		events.creator.forEach((event) => {
			if (event.proposedDate in res) {
				res[event.proposedDate].push(event);
			} else {
				res[event.proposedDate] = [event];
			}
		});
		events.participant.forEach((event) => {
			if (event.proposedDate in res) {
				res[event.proposedDate].push(event);
			} else {
				res[event.proposedDate] = [event];
			}
		});
		return res;
	}, [events]);

	const renderDateCellOverride = (moment: Moment) => {
		const date = moment.date();
		const standardDate = moment.format(EVENT_DATE_FORMAT);
		const hasEvents = Object.keys(dateToEventMap).includes(standardDate);

		return (
			<div
				className={`h-20 w-full flex flex-col text-black ${
					hasEvents ? 'bg-cyan-50' : ''
				}`}
				style={{
					paddingRight: '12px',
					margin: 0,
					border: '0.5px solid lightgray',
				}}
				key={date}
			>
				{date}
				{hasEvents && getBadges(standardDate)}
			</div>
		);
	};

	const getBadges = (date: string) => {
		const events = dateToEventMap[date];
		return (
			<div>
				{events.map((event) => (
					<Badge
						key={event.eventResultId}
						status={event.creatorId === me.uuid ? 'success' : 'warning'}
						text={event.name}
					/>
				))}
			</div>
		);
	};

	return (
		<Calendar
			dateFullCellRender={renderDateCellOverride}
			defaultValue={moment().add(6, 'days')}
		/>
	);
});
