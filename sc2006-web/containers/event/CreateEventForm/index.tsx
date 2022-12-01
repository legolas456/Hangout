/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useContext, useState } from 'react';
import { Card, InputLabel, TextInput } from '../../../components/common';
import { Form, Input, FormInstance } from 'antd';
import { GlobalContext } from '../../../contexts';
import { AddUserToEventModal } from '../AddUserToEventModal';
import { ParticipantsSection } from '../ParticipantsSection';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
	CreateEventRes,
	DbUserRes,
	EventParticipant,
	PublicEventParticipant,
} from '../../../types';
import { useNotification } from '../../../hooks';

interface CreateEventForm {
	name: string;
	participants: Array<EventParticipant>;
}

interface CreateEventFormProps {
	form: FormInstance;
	initialValues: CreateEventForm;
	onSubmitHandler: (form: CreateEventForm) => Promise<CreateEventRes | void>;
	limitFeatures?: boolean;
	submitText?: string;
}

export const CreateEventForm = ({
	form,
	initialValues,
	onSubmitHandler,
	limitFeatures = false,
	submitText = 'Create Event',
}: CreateEventFormProps) => {
	const { me } = useContext(GlobalContext);
	const notification = useNotification();
	const { setFieldValue, getFieldValue, validateFields } = form;

	const [isInviteUserModal, setIsInviteUserModalOpen] = useState(false);
	const [addedAuthParticipants, setAddedAuthParticipants] = useState<
		Set<string>
	>(new Set(me ? [me.uuid] : []));
	const [publicParticipantFormInstances, setPublicParticipantFormInstances] =
		useState<FormInstance<PublicEventParticipant>[]>([]);
	const [expandedParticipants, setExpandedParticipants] = useState<Set<string>>(
		new Set(),
	);

	const onAddAuthUser = (userEmail: string, user: DbUserRes) => {
		const currentParticipants = getFieldValue('participants');

		if (limitFeatures && currentParticipants.length >= 5) {
			notification.warning(
				'Please log in to remove restricted usage of the app',
				'Cannot add anymore participants',
			);
			return;
		}

		const newParticipant: EventParticipant = {
			uuid: userEmail,
			isCreator: false,
			name: userEmail,
			preferences: user.preferences,
			address: user.address ? user.address.toString() : '',
			schedule: user.schedule,
		};
		const newParticipants = [...currentParticipants, newParticipant];

		setFieldValue('participants', newParticipants);
		setAddedAuthParticipants((added) => {
			const copy = new Set(added);
			return copy.add(userEmail);
		});
	};

	const onRemoveParticipant = (name: string) => {
		const currentParticipants: EventParticipant[] =
			getFieldValue('participants');
		const newParticipants = currentParticipants.filter(
			(participant) => participant.name !== name,
		);
		setAddedAuthParticipants((added) => {
			const newAdded = new Set(added);
			newAdded.delete(name);
			return newAdded;
		});
		setFieldValue('participants', newParticipants);
	};

	const validateAndSubmit = async (form: CreateEventForm) => {
		publicParticipantFormInstances.forEach((formInstance) => {
			formInstance.submit();
		});
		console.log(form);

		const participants: Array<EventParticipant> = getFieldValue('participants');

		let hasError = false;
		await Promise.all(
			publicParticipantFormInstances
				.map(async (formInstance) => {
					return await formInstance.validateFields();
				})
				.concat(await validateFields()),
		).catch((e) => {
			hasError = true;
			notification.error(
				'One or more inputs have errors. Please check them carefully',
				'Input Error',
			);
			const indexes = participants.map((p, index) => index.toString());
			setExpandedParticipants(new Set(indexes));
		});

		if (participants.length < 2) {
			notification.error(
				'There should be at least two participants in an event',
				'Input Error',
			);
			hasError = true;
		}
		if (!hasError) {
			onSubmitHandler(form);
		}
	};

	return (
		<>
			<Card className="p-8 space-y-2 w-full h-full overflow-auto">
				{!limitFeatures && (
					<div className="flex flex-row items-center space-x-2 pb-2">
						<InfoCircleOutlined
							className="w-4"
							style={{ fontSize: '1rem', color: 'red' }}
						/>
						<b>
							The generated proposed date will be automatically added to your
							schedule. You can remove it from your schedule by updating your
							profile.
						</b>
					</div>
				)}
				<Form
					className="w-full h-full flex flex-col"
					initialValues={initialValues}
					form={form}
					onFinish={validateAndSubmit}
				>
					<InputLabel>Name of Event</InputLabel>
					<Form.Item
						name="name"
						rules={[
							{
								required: true,
								message: 'Name of Event cannot be empty',
							},
							{
								min: 10,
								message: 'Name of Event must be at least 10 characters',
							},
							{
								max: 50,
								message: 'Name of Event cannot exceed 50 characters',
							},
						]}
					>
						{limitFeatures ? (
							<TextInput
								onChange={() => null}
								value={getFieldValue('name')}
								placeholder={getFieldValue('name')}
								disabled
							/>
						) : (
							<TextInput
								onChange={(e: any) => setFieldValue('name', e.target.value)}
								value={getFieldValue('name')}
							/>
						)}
					</Form.Item>
					<Form.Item name="participants" dependencies={['participants']}>
						<ParticipantsSection
							setIsInviteUserModalOpen={setIsInviteUserModalOpen}
							onRemoveParticipant={onRemoveParticipant}
							form={form}
							limitFeatures={limitFeatures}
							setFormInstances={setPublicParticipantFormInstances}
							formInstances={publicParticipantFormInstances}
							expanded={expandedParticipants}
							setExpanded={setExpandedParticipants}
						/>
					</Form.Item>

					<div className="pt-2 w-2/5 flex flex-row justify-self-end self-center space-x-4">
						<Input
							type="submit"
							value={submitText}
							size="small"
							className="h-8 sky-400"
						/>
					</div>
				</Form>
			</Card>
			{!limitFeatures && (
				<AddUserToEventModal
					open={isInviteUserModal}
					onOk={(uuid: string, user: DbUserRes) => {
						onAddAuthUser(uuid, user);
						setIsInviteUserModalOpen(false);
					}}
					onCancel={() => {
						setIsInviteUserModalOpen(false);
					}}
					addedParticipants={addedAuthParticipants}
				/>
			)}
		</>
	);
};
