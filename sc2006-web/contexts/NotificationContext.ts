import { createContext, ReactNode } from 'react';
import { ArgsProps } from 'antd/lib/notification';
import { PresentableError } from '../lib/error';

export type NotificationProps = Omit<ArgsProps, 'type' | 'description'> & {
	type: 'info' | 'success' | 'warning' | 'error';
	title?: ReactNode;
};

export type NotificationExtraProps = Omit<
	NotificationProps,
	'type' | 'message' | 'description'
>;

export interface NotificationContextProps {
	info: (
		message: ReactNode,
		title?: ReactNode,
		extra?: NotificationExtraProps,
	) => void;
	success: (
		message: ReactNode,
		title?: ReactNode,
		extra?: NotificationExtraProps,
	) => void;
	warning: (
		message: ReactNode,
		title?: ReactNode,
		extra?: NotificationExtraProps,
	) => void;
	error: (
		message: ReactNode,
		title?: ReactNode,
		extra?: NotificationExtraProps,
	) => void;

	apiError: (err: PresentableError) => void;
	genericError: () => void;
	incompleteFormError: () => void;
	invalidInputError: () => void;
}

export const NotificationContext = createContext<NotificationContextProps>(
	null as any,
);
