/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useContext } from 'react';
import { Form, PageHeader } from 'antd';
import { GlobalContext } from '../../contexts';
import { CreateEventReq } from '../../types';
import { useNotification } from '../../hooks';
import { useRouter } from 'next/router';
import { CreateEventForm } from '../../containers/event/CreateEventForm';
import { eventService } from '../../services';

const CreateEventPage = () => {
	const { me, setMe } = useContext(GlobalContext);
	const notification = useNotification();
	const router = useRouter();
	const [form] = Form.useForm<CreateEventReq>();
	const onSubmit = async (form: CreateEventReq) => {
		try {
			console.log(form);
			await eventService.create(form);
			await router.push('/events');
			notification.success(
				<div>
					Successfully created event <b>{form.name}</b>
				</div>,
				'Event created!',
			);
		} catch (e) {
			const error = e.title
				? e
				: {
						name: '',
						level: 'error',
						message: 'Please check your inputs or alert us.',
						title: 'Failed to create Event',
				  };
			notification.apiError(error);
		}
	};
	if (!me) {
		return null;
	}
	// Let current user be of type PublicEventParticipant to allow user to edit his info.
	const initialFormValues: CreateEventReq = {
		name: '',
		participants: [
			{
				...me,
				isCreator: true,
				name: me.uuid,
				address: me.address?.toString() || '',
			},
		],
	};

	return (
		<div className="flex flex-col w-full h-full items-center">
			<PageHeader
				onBack={() => router.back()}
				title="Create Event"
				className="self-start"
			/>
			<div className="w-5/6 h-5/6">
				<CreateEventForm
					form={form}
					initialValues={initialFormValues}
					onSubmitHandler={onSubmit}
				/>
			</div>
		</div>
	);
};

export default CreateEventPage;
