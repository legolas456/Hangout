import {
	NotificationContext,
	NotificationContextProps,
	NotificationExtraProps,
} from '../../contexts/';

import React, { ReactNode } from 'react';
import { notification } from 'antd';
import { PresentableError } from '../../lib/error';
import { NAVIGATION_HEIGHT } from '../../constants';

export interface NotificationContainerProps {
	children: ReactNode;
	topOffset?: number;
}

export const NotificationContainer = ({
	children,
	topOffset,
}: NotificationContainerProps) => {
	const baseNotificationStyle = {
		color: 'rgba(0, 0, 0, 0.65)',
	};

	const baseNotificationProps = {
		top: NAVIGATION_HEIGHT + 5,
	};

	const info = (
		message: ReactNode,
		title?: ReactNode,
		extra?: NotificationExtraProps,
	) => {
		notification.info({
			description: message,
			message: title ?? 'Info',
			style: {
				...baseNotificationStyle,
				border: '1px solid #91d5ff',
				backgroundColor: '#e6f7ff',
			},
		});
	};

	const success = (
		message: ReactNode,
		title?: ReactNode,
		extra?: NotificationExtraProps,
	) => {
		notification.success({
			description: message,
			message: title ?? 'Success',
			style: {
				...baseNotificationStyle,
				border: '1px solid #b7eb8f',
				backgroundColor: '#f6ffed',
			},
		});
	};

	const warning = (
		message: ReactNode,
		title?: ReactNode,
		extra?: NotificationExtraProps,
	) => {
		notification.warning({
			description: message,
			message: title ?? 'Success',
			style: {
				...baseNotificationStyle,
				border: '1px solid #ffe58f',
				backgroundColor: '#fffbe6',
			},
		});
	};

	const error = (
		message: ReactNode,
		title?: ReactNode,
		extra?: NotificationExtraProps,
	) => {
		notification.error({
			description: message,
			message: title ?? 'Info',
			style: {
				...baseNotificationStyle,
				border: '1px solid #ffa39e',
				backgroundColor: '#fff1f0',
			},
			...baseNotificationProps,
		});
	};

	const showPresentableError = (err: PresentableError) => {
		const { title, message, level = 'error' } = err;
		switch (level) {
			case 'info':
				return info(message, title);
			case 'warning':
				return warning(message, title);
			case 'error':
				return error(message, title);
			default: //success
				return success(message, title);
		}
	};

	const apiError = (err: PresentableError) => {
		showPresentableError(err);
	};

	const genericError = () => {
		// TODO
		return null;
	};

	const incompleteFormError = () => {
		// TODO
		return null;
	};

	const invalidInputError = () => {
		// TODO
		return null;
	};

	const contextValue: NotificationContextProps = {
		info,
		success,
		warning,
		error,
		apiError,
		genericError,
		incompleteFormError,
		invalidInputError,
	};

	return (
		<>
			<div
				id="notificationContainer"
				className="fixed p-8"
				style={{
					zIndex: 1001,
				}}
			/>
			<NotificationContext.Provider value={contextValue}>
				{children}
			</NotificationContext.Provider>
		</>
	);
};
