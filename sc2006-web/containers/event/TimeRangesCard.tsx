/* eslint-disable no-mixed-spaces-and-tabs */

import React, { useState } from 'react';
import { Button, TimePicker } from 'antd';
import moment from 'moment';
import { useNotification } from '../../hooks';
import { EVENT_DATETIME_FORMAT, EVENT_DATE_FORMAT } from '../../types';

interface TimeRangesCardProps {
	addedTimeRanges: Array<{ start: string; end: string }>;
	addTimeRange: (range: [string, string]) => void;
	removeTimeRange: (index: number) => void;
	date: string;
}

export const TimeRangesCard = ({
	addedTimeRanges,
	addTimeRange,
	removeTimeRange,
	date,
}: TimeRangesCardProps) => {
	const { RangePicker } = TimePicker;
	const TIME_FORMAT = 'HH:mm';
	const [selectedTimeRange, setSelectedTimeRange] = useState<
		[start: string, end: string]
	>([
		moment(date, EVENT_DATE_FORMAT)
			.startOf('day')
			.format(EVENT_DATETIME_FORMAT),
		moment(date, EVENT_DATE_FORMAT)
			.endOf('day')
			.minutes(0)
			.format(EVENT_DATETIME_FORMAT),
	]);

	const notification = useNotification();

	const onAddTimeRange = (range: [any, any]) => {
		if (!range || range.length < 2) {
			return notification.error(
				'Please fill both start time and end time',
				'Invalid Time Range',
			);
		}
		const [start, end] = range;
		const startMoment = moment(start, EVENT_DATETIME_FORMAT);
		const endMoment = moment(end, EVENT_DATETIME_FORMAT);
		if (startMoment.isAfter(endMoment)) {
			return notification.error(
				'Please start time must be before end time',
				'Invalid Time Range',
			);
		}
		const formattedTimeRange = [
			startMoment.format(EVENT_DATETIME_FORMAT),
			endMoment.format(EVENT_DATETIME_FORMAT),
		] as [string, string];
		addTimeRange(formattedTimeRange);
	};

	return (
		<div className="space-y-2">
			<div>
				Please pick the time ranges you are{' '}
				<b className="text-cyan-500">busy</b>
			</div>
			<div className="flex flex-row items-center space-x-4">
				<RangePicker
					minuteStep={15}
					format={TIME_FORMAT}
					onChange={(values) => {
						setSelectedTimeRange(values as any);
					}}
					value={
						selectedTimeRange.length
							? [
									moment(selectedTimeRange[0], EVENT_DATETIME_FORMAT),
									moment(selectedTimeRange[1], EVENT_DATETIME_FORMAT),
							  ]
							: [
									moment(date, EVENT_DATE_FORMAT).startOf('day'),
									moment(date, EVENT_DATE_FORMAT).endOf('day').minutes(0),
							  ]
					}
				/>
				<Button
					onClick={() => {
						onAddTimeRange(selectedTimeRange);
						setSelectedTimeRange((prevTimeRange) => [
							prevTimeRange[1],
							moment(prevTimeRange[1])
								.endOf('day')
								.minutes(0)
								.format(EVENT_DATETIME_FORMAT),
						]);
					}}
				>
					Add
				</Button>
			</div>
			<div className="flex flex-col">
				<b>Selected time ranges</b>
				<div className="space-y-2">
					{addedTimeRanges.length
						? addedTimeRanges.map((range, index) => {
								const { start, end } = range;
								return (
									<div
										key={index}
										className="flex flex-row items-center space-x-2"
									>
										<p className="my-auto">
											[{moment(start).format(TIME_FORMAT)},{' '}
											{moment(end).format(TIME_FORMAT)}]
										</p>
										<Button onClick={() => removeTimeRange(index)}>
											Remove
										</Button>
									</div>
								);
						  })
						: '-'}
				</div>
			</div>
		</div>
	);
};
