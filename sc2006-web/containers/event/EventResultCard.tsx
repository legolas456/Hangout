import React, { useState, useMemo, ReactNode, useContext } from 'react';
import { DbEventResultRes, DbPlace, EVENT_DATETIME_FORMAT } from '../../types';
import {
	Card,
	FieldRow,
	CollapseItemHeader,
	MapCard,
	Marker,
} from '../../components/common';
import moment from 'moment';
import { Collapse, Tooltip } from 'antd';
import { PresentablePlaceTypeMap } from '.././../constants';
import { InfoCircleOutlined } from '@ant-design/icons';

interface EventResultCardProps {
	eventResult: DbEventResultRes & { proposedDate: string };
}

type PresentablePlaceProps = 'name' | 'address' | 'postal';

export const EventResultCard = ({ eventResult }: EventResultCardProps) => {
	const [centerMap, setCenterMap] = useState<Record<string, number>>(() => {
		const res: Record<string, number> = {};
		if (!eventResult) {
			return res;
		}
		Object.keys(eventResult.suggestions).map((placeType) => {
			res[placeType] = 0;
		});
		return res;
	});

	const placeMarkers = useMemo(() => {
		const res: Record<string, ReactNode[]> = {};
		Object.keys(eventResult.suggestions).map((placeType) => {
			res[placeType] = eventResult.suggestions[placeType].map(
				(place, index) => {
					const { coordinates, postal } = place;
					return (
						<Marker
							position={{ lat: coordinates[0], lng: coordinates[1] }}
							title={`Place ${index + 1}: ${place.name}`}
							key={place.address}
						/>
					);
				},
			);
		});
		return res;
	}, [eventResult.suggestions]);

	const getCenter = (placeType: string) => {
		const index = centerMap[placeType] || 0;
		const place = eventResult.suggestions[placeType][index];
		return {
			lat: place.coordinates[0],
			lng: place.coordinates[1],
		};
	};

	const [expandedPlaceTypes, setExpandedPlaceTypes] = useState<Set<string>>(
		new Set([Object.keys(eventResult.suggestions)[0]]),
	);

	const presentablePlaceProps: PresentablePlaceProps[] = ['name', 'address'];
	return (
		<Card className="p-8 mb-16 w-full">
			<h2 className="text-xl flex flex-row justify-start items-center">
				Proposed Date
				<Tooltip
					title="The proposed date is the date with the most number of hours in which participants are free"
					className="w-full"
				>
					<InfoCircleOutlined
						className="ml-2 w-4"
						style={{ fontSize: '1rem' }}
					/>
				</Tooltip>
			</h2>

			<div
				key={eventResult.proposedDate}
				className="flex flex-row items-center"
			>
				<h3 className="w-1/6 m-0 pr-4 text-center">
					{eventResult.proposedDate}
				</h3>
				<div className="w-5/6 flex flex-row space-x-2">
					{eventResult.suggestedDates[eventResult.proposedDate].map(
						(timing, index) => {
							const { start, end } = timing;
							return (
								<Card
									key={index}
									className="p-2 hover:bg-cyan-400 hover:text-white flex flex-row w-fit"
									style={{ marginRight: '0' }}
								>
									{moment(start, EVENT_DATETIME_FORMAT).format('HH:mm')} -&gt;{' '}
									{moment(end, EVENT_DATETIME_FORMAT).format('HH:mm')}
								</Card>
							);
						},
					)}
				</div>
			</div>
			{/* <div className="flex flex-col space-y-4">
				{eventResult.suggestedDates &&
					Object.keys(eventResult.suggestedDates).map((date) => {
						const suggestedTimings = eventResult.suggestedDates[date];
						return (
							<div key={date} className="flex flex-row items-center">
								<h3 className="w-1/6 m-0 pr-4 text-center">{date}</h3>
								<div className="w-5/6 flex flex-row space-x-2">
									{suggestedTimings.map((timing, index) => {
										const { start, end } = timing;
										return (
											<Card
												key={index}
												className="p-2 hover:bg-cyan-400 hover:text-white flex flex-row w-fit"
												style={{ marginRight: '0' }}
											>
												{moment(start, EVENT_DATETIME_FORMAT).format('HH:mm')}{' '}
												-&gt;{' '}
												{moment(end, EVENT_DATETIME_FORMAT).format('HH:mm')}
											</Card>
										);
									})}
								</div>
							</div>
						);
					})}
			</div> */}
			<h2 className="text-xl mt-8 flex flex-row justify-start items-center">
				Suggested Places Per Type
				<Tooltip
					title="The proposed places are the ones that are nearest to the central coordinate from everyone."
					className="w-full"
				>
					<InfoCircleOutlined
						className="ml-2 w-4"
						style={{ fontSize: '1rem' }}
					/>
				</Tooltip>
			</h2>
			<Collapse
				bordered={false}
				ghost
				onChange={(key) => setExpandedPlaceTypes(new Set(key))}
				activeKey={Array.from(expandedPlaceTypes)}
			>
				{eventResult.suggestions &&
					Object.keys(eventResult.suggestions).map((placeType) => {
						return (
							<Collapse.Panel
								showArrow={false}
								key={placeType}
								header={
									<CollapseItemHeader
										title={PresentablePlaceTypeMap[placeType]}
										isExpanded={expandedPlaceTypes.has(placeType)}
									/>
								}
							>
								{eventResult.suggestions[placeType].map((place, index) => {
									return (
										<div
											key={index}
											onClick={() => {
												setCenterMap((map) => ({
													...map,
													[placeType]: index,
												}));
											}}
											className="cursor-pointer hover:border-x-2 border-black"
										>
											{presentablePlaceProps.map(
												(propName: PresentablePlaceProps) => {
													return (
														<FieldRow
															key={propName}
															label={propName}
															value={
																propName === 'postal'
																	? place[propName].toString()
																	: place[propName]
															}
															highlight={index % 2 === 0}
															isValuePresentable
														/>
													);
												},
											)}
										</div>
									);
								})}
								<div className="flex flex-row justify-center">
									<MapCard
										markers={placeMarkers[placeType]}
										center={getCenter(placeType)}
									/>
								</div>
							</Collapse.Panel>
						);
					})}
			</Collapse>
		</Card>
	);
};
