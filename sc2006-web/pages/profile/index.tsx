/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useMemo, useContext, useState } from 'react';
import { Regex } from '../../types';
import { UpdatableUserProps } from '../../types/api-models/user';
import { TextInput } from '../../components/common';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { FieldRow } from '../../components/common/FieldRow';
import { FormRule, Form, Button } from 'antd';
import { ScheduleModal } from '../../containers/event/ScheduleModal';
import { PreferencesModal } from '../../containers/event/PreferencesModal';
import { GlobalContext } from '../../contexts';
import { useNotification } from '../../hooks';
import { userService } from '../../services';

type FieldName = 'preferences' | 'schedule' | 'address';

interface UserItem {
	key: FieldName;
	label: string;
}

const ProfilePage = function () {
	const initialDirtyMap = {
		preferences: false,
		schedule: false,
		address: false,
	};
	const [form] = Form.useForm<UpdatableUserProps>();
	const [isDirty, setIsDirty] = useState(false);
	const [dirtyMap, setDirtyMap] =
		useState<Record<FieldName, boolean>>(initialDirtyMap);
	const { setFieldValue, getFieldValue, setFieldsValue, getFieldsValue } = form;
	const { me, setMe } = useContext(GlobalContext);
	const notification = useNotification();

	if (me && !Object.keys(getFieldsValue()).length) {
		setFieldsValue(me);
	}

	const getEditable = (name: FieldName) => {
		switch (name) {
			case 'schedule':
			case 'preferences':
				return undefined;
			default:
				return TextInput;
		}
	};

	const participantItems: UserItem[] = useMemo(
		() => [
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
					message: 'Postal Code is required',
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
		if (!isDirty) {
			setIsDirty(true);
		}
		if (!dirtyMap[key]) {
			setDirtyMap((prevMap) => ({ ...prevMap, [key]: true }));
		}
		setFieldValue(key, value);
	};

	const onSubmit = async (form: UpdatableUserProps) => {
		try {
			const { preferences, schedule, address } = form;
			const req = {
				...(dirtyMap['preferences'] && { preferences }),
				...(dirtyMap['schedule'] && { schedule }),
				...(dirtyMap['address'] && { address }),
			};
			await userService.updateUser({
				uuid: me!.uuid,
				user: req,
			});
			notification.success(
				<div> Successfully Updated Profile </div>,
				'profile updated',
			);
			setIsDirty(false);
			setDirtyMap(initialDirtyMap);
		} catch (e) {
			const error = e.title
				? e
				: {
						name: '',
						level: 'error',
						message: 'Please check inputs and alert us',
						title: 'Failed to update profile',
				  };
			notification.apiError(error);
		}
	};

	return (
		<div className="w-8/12 h-full space-y-8 top-1/4 relative">
			{me && (
				<Form form={form} onFinish={onSubmit} initialValues={me}>
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
									value={getFieldValue(key) as any}
									highlight={index % 2 == 0}
									allowEdit
									CancelEditIcon={CheckOutlined}
									AllowEditIcon={EditOutlined}
									Editable={getEditable(key)}
									onEditFinish={(value?: any) => onEditFinish(key, value)}
									Presentable={modal}
									presentableProps={{
										width: '90%',
										...(key === 'schedule' && {
											busyTimeRanges: getFieldValue(key),
										}),
										...(key === 'preferences' && {
											selectedPreferences: getFieldValue(key),
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
								value={getFieldValue(key) as any}
								highlight={index % 2 == 0}
								allowEdit
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
			)}

			<div className="w-full flex flex-row justify-center">
				<Button onClick={() => form.submit()} disabled={!isDirty}>
					{' '}
					Update settings
				</Button>
			</div>
		</div>
	);
};

export default ProfilePage;
