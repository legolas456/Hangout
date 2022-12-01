import { ErrorUtil } from '.';

type ErrorResponse = Response & {
	message?: string;
};

interface ThrowErrorOrGetDataOptions {
	fallbackTitle?: string;
	fallbackMessage?: string;
	overrideTitle?: string;
	overrideMessage?: string;
}

/*
	If a response is successful, simply return it
	Otherwise, extract the error message and return an PresentableError
*/
export async function throwErrorOrGetData<T>(
	response: ErrorResponse,
	options: ThrowErrorOrGetDataOptions,
): Promise<T> {
	const { status } = response;
	const data = await response.json();
	const { fallbackTitle, fallbackMessage, overrideTitle, overrideMessage } =
		options;
	const { error, message } = data;
	if (!error && status < 205) {
		return data;
	}
	if (error) {
		throw ErrorUtil.apiError(
			overrideMessage || error.message || fallbackMessage,
			overrideTitle || error.title || fallbackTitle,
			error.level,
		);
	} else {
		throw ErrorUtil.apiError(message || fallbackMessage, fallbackTitle);
	}
}
