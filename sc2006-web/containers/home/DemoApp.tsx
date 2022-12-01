import React, { useContext, useState, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { CreateEventForm } from '../event/CreateEventForm';
import { CreateEventReq, DbEventResultRes } from '../../types';
import { eventService } from '../../services';
import { useNotification } from '../../hooks';
import { EventResultCard } from '../event/EventResultCard';

export const DemoApp = () => {
	const notification = useNotification();
	const eventResultRef = useRef<HTMLDivElement>(null);
	const [form] = Form.useForm<CreateEventReq>();
	const [eventResult, setEventResult] = useState<
		DbEventResultRes & { proposedDate: string }
	>();
	const initialFormValues: CreateEventReq = {
		name: 'This is a demo, some features may be limited.',
		participants: [],
	};
	const onSubmit = async (formValues: CreateEventReq) => {
		console.log(formValues);
		let hasError = false;

		try {
			const result = await eventService.generateEventResult(formValues);
			setEventResult(result);
		} catch (e) {
			hasError = true;
			if ('title' in e) {
				notification.apiError(e);
			} else {
				notification.error(e.message, 'Could not generate a result');
			}
		}
	};

	useEffect(() => {
		if (eventResult) {
			window.scrollTo({
				top: eventResultRef.current?.offsetTop,
				behavior: 'smooth',
			});
		}
	}, [eventResult]);

	return (
		<>
			<div className="flex flex-row justify-center w-full min-h-screen space-y-16">
				<div className="w-10/12 h-fit">
					<CreateEventForm
						limitFeatures
						form={form}
						onSubmitHandler={onSubmit}
						initialValues={initialFormValues}
					/>
				</div>
			</div>

			<div ref={eventResultRef}>
				{eventResult && (
					<div className="w-screen h-screen flex flex-col items-center bg-slate-50">
						<div className="w-10/12 space-y-16">
							<h1 className="mt-4 text-2xl text-center">Event Result</h1>
							<EventResultCard eventResult={eventResult} />
						</div>
					</div>
				)}
			</div>
		</>
	);
};
