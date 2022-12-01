/* eslint-disable @typescript-eslint/ban-types*/
import React, { useState, useMemo } from 'react';
import { Modal, ModalProps } from 'antd';
import { TreeSelect } from 'antd';

export type PreferencesModalProps = Omit<ModalProps, 'onOk'> & {
	onOk: (value: any) => void;
	selectedPreferences: Array<string>;
	viewOnly: boolean;
};

export const PreferencesModal = React.memo(function _PreferencesModal({
	onOk,
	selectedPreferences,
	viewOnly,
	...modalProps
}: PreferencesModalProps) {
	const treeData = useMemo(
		() => [
			{
				title: 'Activities',
				value: 'activity',
				children: [
					{
						title: 'Community Centres',
						value: 'activity.community_center',
					},
					{
						title: 'Sport Clubs',
						value: 'activity.sport_club',
					},
				],
			},
			{
				title: 'Shopping',
				value: 'commercial',
				children: [
					{
						title: 'Outdoor and sports shops',
						value: 'commercial.outdoor_and_sport',
					},
					{
						title: 'Shopping malls',
						value: 'commercial.shopping_mall',
					},
					{
						title: 'Department stores',
						value: 'commercial.department_store',
					},
					{
						title: 'Hobby-related shops',
						value: 'commercial.hobby',
					},
					{
						title: 'Book shops',
						value: 'commercial.books',
					},
					{
						title: 'Gift and Souvenir shops',
						value: 'commercial.gift_and_souvenir',
					},
					{
						title: 'Tickets and lottery shops',
						value: 'commercial.tickets_and_lottery',
					},
					{
						title: 'Clothing and Bags',
						value: ['commercial.clothing', 'commercial.bag'],
					},
					{
						title: 'Healthy and Beauty shops',
						value: 'commercial.health_and_beauty',
					},
					{
						title: 'Food and Drinks',
						value: 'commercial.food_and_drink',
					},
					{
						title: 'Art and Antiques shops',
						value: ['commercial.art', 'commercial.antiques'],
					},
					{
						title: 'Video and Music shops',
						value: 'commercial.video_and_music',
					},
				],
			},
			{
				title: 'Food',
				value: 'catering',
				children: [
					{
						title: 'Restaurants',
						value: 'catering.restaurant',
					},
					{
						title: 'Fast food',
						value: 'catering.fast_food',
					},
					{
						title: 'Cafes',
						value: 'catering.cafe',
					},
					{
						title: 'Food courts',
						value: 'catering.food_court',
					},
					{
						title: 'Bars and Pubs',
						value: ['catering.bar', 'catering.pub'],
					},
					{
						title: 'Ice cream',
						value: 'catering.ice_cream',
					},
				],
			},
			{
				title: 'Entertainment',
				value: 'entertainment',
				children: [
					{
						title: 'Culture',
						value: 'entertainment.culture',
					},
					{
						title: 'Zoo',
						value: 'entertainment.zoo',
					},
					{
						title: 'Entertainment',
						value: 'entertainment.aquarium',
					},
					{
						title: 'Planetarium',
						value: 'entertainment.planetarium',
					},
					{
						title: 'Cinema',
						value: 'entertainment.cinema',
					},
					{
						title: 'Arcade',
						value: 'entertainment.amusement_arcade',
					},
					{
						title: 'Escape-room',
						value: 'entertainment.escape_game',
					},
					{
						title: 'Miniature golf',
						value: 'entertainment.miniature_golf',
					},
					{
						title: 'Bowling Alley',
						value: 'entertainment.bowling_alley',
					},
					{
						title: 'Theme park',
						value: 'entertainment.theme_park',
					},
					{
						title: 'Flying fox',
						value: 'entertainment.flying_fox',
					},
					{
						title: 'Water park',
						value: 'entertainment.water_park',
					},
				],
			},
			{
				title: 'Leisure',
				value: 'leisure',
				children: [
					{
						title: 'Picnic',
						value: 'leisure.picnic',
					},
					{
						title: 'Barbecue',
						value: 'leisure.picnic.bbq',
					},
					{
						title: 'Playground',
						value: 'leisure.playground',
					},
					{
						title: 'Spa',
						value: 'leisure.spa',
					},
					{
						title: 'Park',
						value: 'leisure.park',
					},
				],
			},
			{
				title: 'Nature',
				value: 'natural',
			},
			{
				title: 'National Park',
				value: 'national_park',
			},
			{
				title: 'Rental',
				value: 'rental',
			},
			{
				title: 'Tourist spots',
				value: 'tourism',
				children: [
					{
						title: 'Attractions',
						value: 'tourism.attraction',
					},
					{
						title: 'Sights',
						value: 'tourism.sights',
					},
				],
			},
			{
				title: 'Camping',
				value: 'camping',
			},
			{
				title: 'Beach',
				value: 'beach',
			},
			{
				title: 'Adult stuff',
				value: 'adult',
				children: [
					{
						title: 'Night club',
						value: 'adult.nightclub',
					},
					{
						title: 'Strip club',
						value: 'adult.stripclub',
					},
					{
						title: 'Casino',
						value: 'adult.casino',
					},
					{
						title: 'Adult Gaming Centre',
						value: 'adult.adult_gaming_centre',
					},
				],
			},
		],
		[],
	);

	const [selectedTypes, setSelectedTypes] = useState<Array<string>>(
		selectedPreferences || [],
	);

	return (
		<Modal
			{...modalProps}
			onOk={() => onOk(selectedTypes)}
			{...(viewOnly && { footer: null })}
		>
			<div className="flex flex-col p-8">
				<b>
					Please be as specific as you can in choosing your preferences,
					otherwise the results suggested to you may not be ideal.
				</b>
				<TreeSelect
					disabled={viewOnly}
					treeData={treeData}
					value={Array.from(selectedTypes)}
					onChange={(values) => setSelectedTypes(values)}
					treeCheckable
					showCheckedStrategy="SHOW_PARENT"
					placeholder="Please select one or more place types you are interested in"
					style={{ width: '100%', minHeight: '24rem' }}
				/>
			</div>
		</Modal>
	);
});
