/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useMemo } from 'react';
import { EventParticipant, Regex } from '../../../types';
import { TextInput } from '../../../components/common';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { FieldRow } from '../../../components/common/FieldRow';
import {
	Collapse,
	CollapsePanelProps,
	FormRule,
	Form,
	FormInstance,
} from 'antd';
import { ScheduleModal } from '../ScheduleModal';
import { PreferencesModal } from '../PreferencesModal';

type FieldName = 'name' | 'preferences' | 'schedule' | 'address';
type PublicParticipantCardProps = CollapsePanelProps & {
	setFormInstances: React.Dispatch<
		React.SetStateAction<Array<FormInstance<EventParticipant>>>
	>;
	participant: EventParticipant;
	onUpdateParticipant: (participant: EventParticipant, index: number) => void;
	index: number;
	allowEdit: boolean;
};

interface ParticipantItem {
	key: FieldName;
	label: string;
}

export const PublicParticipantCard = React.memo(
	function _PublicParticipantCard({
		participant,
		onUpdateParticipant,
		index,
		setFormInstances,
		allowEdit,
		...panelProps
	}: PublicParticipantCardProps) {
		const [form] = Form.useForm<EventParticipant>();
		const { setFieldsValue } = form;

		useEffect(() => {
			let index: number;
			setFormInstances((prevFormInstances) => {
				index = prevFormInstances.length;
				return [...prevFormInstances, form];
			});

			return () => {
				setFormInstances((prevFormInstances) =>
					prevFormInstances.filter((_, i) => i !== index),
				);
			};
		}, []);

		useEffect(() => {
			setFieldsValue(participant);
		}, [participant]);

		const getEditable = (name: FieldName) => {
			switch (name) {
				case 'schedule':
				case 'preferences':
					return undefined;
				default:
					return TextInput;
			}
		};

		const participantItems: ParticipantItem[] = useMemo(
			() => [
				{
					key: 'name',
					label: 'Name:',
				},
				{
					key: 'preferences',
					label: 'Preferences:',
				},
				{
					key: 'schedule',
					label: 'Schedule:',
				},
				{
					key: 'address',
					label: 'Postal Code:',
				},
			],
			[],
		);

		const getFormRule = (name: FieldName): FormRule[] => {
			if (name === 'name') {
				return [
					{ required: true, message: "Participant's name is required" },
					{
						min: 3,
						message: "Participant's name must be at least 3 characters",
					},
				];
			}
			if (name === 'preferences') {
				return [
					{
						type: 'array', // This is important otherwise AntD validates wrongly.
						min: 1,
						message: 'Participant must have at least 1 preferred type of place',
					},
				];
			}
			if (name === 'address') {
				return [
					{
						required: true,
						message: "Participant's address is required",
					},
					{
						pattern: Regex.POSTAL_CODE,
						message: 'Invalid postal code',
					},
				];
			}
			return [];
		};

		const onEditFinish = (key: FieldName, value?: string) => {
			const newParticipant = { ...participant, [key]: value };
			onUpdateParticipant(newParticipant, index);
		};

		return (
			<Collapse.Panel forceRender showArrow={false} {...panelProps}>
				<Form form={form} initialValues={participant}>
					{participantItems.map(({ label, key }, index) => {
						let modal;
						if (key === 'schedule') {
							modal = ScheduleModal;
						}
						if (key === 'preferences') {
							modal = PreferencesModal;
						}

						if (['preferences', 'schedule'].includes(key)) {
							return (
								<FieldRow
									key={key}
									label={label}
									value={participant[key] as any}
									highlight={index % 2 == 0}
									allowEdit={allowEdit}
									CancelEditIcon={CheckOutlined}
									AllowEditIcon={EditOutlined}
									Editable={getEditable(key)}
									onEditFinish={(value?: any) => onEditFinish(key, value)}
									Presentable={modal}
									presentableProps={{
										width: '90%',
										...(key === 'schedule' && {
											busyTimeRanges: participant[key],
										}),
										...(key === 'preferences' && {
											selectedPreferences: participant[key],
										}),
										destroyOnClose: true,
									}}
									formFieldName={key}
									fieldFormRules={getFormRule(key)}
									isValuePresentable={undefined}
								/>
							);
						}
						return (
							<FieldRow
								key={key}
								label={label}
								value={participant[key] as any}
								highlight={index % 2 == 0}
								allowEdit={allowEdit}
								CancelEditIcon={CheckOutlined}
								AllowEditIcon={EditOutlined}
								Editable={getEditable(key)}
								onEditFinish={(value?: any) => onEditFinish(key, value)}
								isValuePresentable
								formFieldName={key}
								fieldFormRules={getFormRule(key)}
							/>
						);
					})}
				</Form>
			</Collapse.Panel>
		);
	},
);
