/* eslint-disable no-mixed-spaces-and-tabs */
import { useRouter } from 'next/router';
import { Form, PageHeader } from 'antd';
import { useContext, useState, useLayoutEffect } from 'react';
import { eventService } from '../../services';
import { useNotification } from '../../hooks';
import {
	CreateEventReq,
	DbEventResultRes,
	DetailedEventRes,
	EVENT_DATE_FORMAT,
	TimeRange,
} from '../../types';
import { GlobalContext, PageTransitionContext } from '../../contexts';
import moment from 'moment';
import { CreateEventForm } from '../../containers/event/CreateEventForm';
import { EventResultCard } from '../../containers/event/EventResultCard';

const EventPage = () => {
	const router = useRouter();
	const notification = useNotification();
	const { setLoading } = useContext(PageTransitionContext);
	const { uuid } = router.query;
	const { me } = useContext(GlobalContext);

	const [eventResult, setEventResult] = useState<DbEventResultRes>();
	const [event, setEvent] = useState<Omit<DetailedEventRes, 'eventResult'>>();

	const [form] = Form.useForm<CreateEventReq>();

	const onSubmit = async (form: CreateEventReq) => {
		try {
			setLoading(true);
			await eventService.updateResult({
				uuid: event!.uuid,
				eventResultId: eventResult!.uuid,
				newEvent: form,
			});
			await router.push('/events');
			notification.success(
				<div>
					Successfully updated event <b>{form.name}</b>
				</div>,
				'Event updated!',
			);
		} catch (e) {
			const error = e.title
				? e
				: {
						name: '',
						level: 'error',
						message: 'Please check your inputs or alert us.',
						title: 'Failed to generate edited Event',
				  };
			notification.apiError(error);
		}
		setLoading(false);
	};

	useLayoutEffect(() => {
		pullAndSetEvent();
	}, []);

	async function pullAndSetEvent() {
		try {
			const event = await eventService.getDetailedEvent({
				uuid: uuid as string,
			});

			const { eventResult, ...eventRest } = event;
			const { suggestedDates, ...eventResultRest } = eventResult;
			const dates = Object.keys(suggestedDates);
			dates.sort((dateString1, dateString2) => {
				const date1 = moment(dateString1, EVENT_DATE_FORMAT).date();
				const date2 = moment(dateString2, EVENT_DATE_FORMAT).date();
				return date1 - date2;
			});
			const sortedSuggestDates: Record<
				string,
				Array<Record<'start' | 'end', string>>
			> = {};
			dates.forEach(
				(date) => (sortedSuggestDates[date] = suggestedDates[date]),
			);
			setEventResult({
				...eventResultRest,
				suggestedDates: sortedSuggestDates,
			});

			setEvent(eventRest);
		} catch (e) {
			notification.apiError(e);
		}
	}

	return (
		<div className="w-full h-full flex flex-col">
			<PageHeader
				onBack={() => router.back()}
				title={
					<h1 className="m-0 text-3xl">
						Event <span className="text-cyan-400">{event?.name}</span> (ref:{' '}
						{uuid})
					</h1>
				}
			/>
			<div className="px-16 pb-16">
				<h1 className="text-2xl">Event Result</h1>
				{eventResult && (
					<EventResultCard
						eventResult={{ ...eventResult, proposedDate: event!.proposedDate }}
					/>
				)}
				{event && event.creatorId === me?.uuid && (
					<>
						<h1 className="text-2xl">Edit and re-generate result</h1>
						<div className="w-full flex flex-row justify-center">
							{event && (
								<CreateEventForm
									form={form}
									initialValues={{
										name: event.name,
										participants: event.participants,
									}}
									onSubmitHandler={onSubmit}
									submitText="Update Event"
								/>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default EventPage;
