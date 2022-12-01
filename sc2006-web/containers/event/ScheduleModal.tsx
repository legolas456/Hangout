/* eslint-disable @typescript-eslint/ban-types*/
import React, { useState, useMemo } from 'react';
import { Badge, Calendar, Collapse, Modal, ModalProps } from 'antd';
import moment, { Moment } from 'moment';
import { CollapseItemHeader } from '../../components/common';
import { TimeRangesCard } from './TimeRangesCard';
import { EVENT_DATE_FORMAT } from '../../types';

export type ScheduleModalProps = Omit<ModalProps, 'onOk'> & {
	onOk: (value: any) => void;
	busyTimeRanges: Record<string, Array<{ start: string; end: string }>>;
	viewOnly: boolean;
};

export const ScheduleModal = React.memo(function _ScheduleModal({
	onOk,
	busyTimeRanges,
	viewOnly,
	...modalProps
}: ScheduleModalProps) {
	const now = moment();
	const startDate = moment(now).add(1, 'days').startOf('day');
	const endDate = moment(startDate).add(6, 'days').endOf('day');

	const [selectedDates, setSelectedDates] = useState<Set<string>>(
		new Set(
			Object.keys(busyTimeRanges || []).filter((date) =>
				moment(date, EVENT_DATE_FORMAT).isBetween(
					startDate,
					endDate,
					undefined,
					'[]',
				),
			),
		),
	);
	const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
	const [internalBusyTimeRanges, setInternalBusyTimeRanges] = useState<
		Record<string, Array<{ start: string; end: string }>>
	>(busyTimeRanges || {});

	const onSelectDate = (moment: Moment) => {
		const presentableDate = moment.format(EVENT_DATE_FORMAT);
		if (!moment.isBetween(startDate, endDate, undefined, '[]')) return;
		setSelectedDates((selected) => {
			const selectedCopy = new Set(selected);

			if (selected.has(presentableDate)) {
				setInternalBusyTimeRanges((timeRanges) => {
					const { [presentableDate]: _, ...rest } = timeRanges;
					return rest;
				});
				selectedCopy.delete(presentableDate);
				return selectedCopy;
			} else {
				setInternalBusyTimeRanges((timeRanges) => {
					return { ...timeRanges, [presentableDate]: [] };
				});
				return selectedCopy.add(presentableDate);
			}
		});
	};

	const renderDateCellOverride = (moment: Moment) => {
		const presentableDate = moment.format(EVENT_DATE_FORMAT);
		const date = moment.date();
		let bgColorClassName = '';

		const isInRange = moment.isBetween(startDate, endDate, undefined, '[]');
		if (!isInRange) {
			bgColorClassName = 'bg-gray-50';
		} else if (selectedDates.has(presentableDate)) {
			bgColorClassName = 'bg-cyan-50';
		}

		return (
			<div
				className={'h-20 w-full flex flex-col text-black '.concat(
					bgColorClassName,
				)}
				style={{
					paddingRight: '12px',
					margin: 0,
					border: '0.5px solid lightgray',
				}}
				key={date}
			>
				{date}
				{isInRange && internalBusyTimeRanges
					? getBadge(internalBusyTimeRanges[presentableDate])
					: null}
			</div>
		);
	};

	const onAddTimeRange = (
		range: { start: string; end: string },
		date: string,
	) =>
		setInternalBusyTimeRanges((timeRanges) => {
			if (!timeRanges) return timeRanges;
			const oldTimeRange = timeRanges[date];
			const newTimeRange = oldTimeRange.length
				? [...oldTimeRange, range]
				: [range];

			return {
				...internalBusyTimeRanges,
				[date]: newTimeRange,
			};
		});

	const onRemoveTimeRange = (index: number, date: string) => {
		setInternalBusyTimeRanges((internalBusyTimeRanges) => {
			if (internalBusyTimeRanges.length) return internalBusyTimeRanges;
			const oldTimeRange = internalBusyTimeRanges[date];
			const newTimeRange = [
				...oldTimeRange.slice(0, index),
				...oldTimeRange.slice(index + 1),
			];
			return {
				...internalBusyTimeRanges,
				[date]: newTimeRange,
			};
		});
	};

	const getBadge = (timeRanges: { start: string; end: string }[]) => {
		let totalBusyTime = 0;
		if (timeRanges && timeRanges.length) {
			totalBusyTime = timeRanges.reduce((accm, timeRange) => {
				const { start, end } = timeRange;
				const startTime = moment(start);
				const endTime = moment(end);
				return accm + endTime.hours() - startTime.hours();
			}, 0);
		}

		let text = 'Quite free';
		if (totalBusyTime > 3) {
			text = 'A little busy';
		}
		if (totalBusyTime > 5) {
			text = 'Quite busy';
		}

		return (
			<Badge
				status={
					totalBusyTime > 5
						? 'warning'
						: totalBusyTime > 3
						? 'warning'
						: 'success'
				}
				text={text}
			/>
		);
	};

	return (
		<Modal
			{...modalProps}
			onOk={() => onOk(internalBusyTimeRanges)}
			style={{ maxHeight: '80vh' }}
			{...(viewOnly && { footer: null })}
		>
			<div className="flex flex-row" style={{ height: '70vh' }}>
				<Calendar
					validRange={[startDate, endDate]}
					onSelect={!viewOnly ? onSelectDate : undefined}
					className="w-4/6"
					dateFullCellRender={renderDateCellOverride}
					defaultValue={endDate}
				/>
				<div className="w-2/6 pl-4 overflow-y-auto scroll-m-4">
					<Collapse
						bordered={false}
						ghost={true}
						onChange={(key) => setExpandedDates(new Set(key))}
						activeKey={Array.from(expandedDates)}
					>
						{Array.from(selectedDates).map((date) => (
							<Collapse.Panel
								key={date}
								header={
									<CollapseItemHeader
										title={date}
										isExpanded={expandedDates.has(date.toString())}
									/>
								}
								forceRender
								showArrow={false}
							>
								<TimeRangesCard
									addedTimeRanges={
										internalBusyTimeRanges[date]
											? internalBusyTimeRanges[date]
											: []
									}
									addTimeRange={(range) =>
										onAddTimeRange({ start: range[0], end: range[1] }, date)
									}
									removeTimeRange={(index) => onRemoveTimeRange(index, date)}
									date={date}
								/>
							</Collapse.Panel>
						))}
					</Collapse>
				</div>
			</div>
		</Modal>
	);
});
