import { PresentableError, defaultApiErrMessage } from '.';

export class ErrorUtil {
	static apiError = (
		message: string = defaultApiErrMessage,
		title = 'SERVER ERROR',
		level = 'error',
	) =>
		new PresentableError({
			level,
			title,
			message,
		});
}
