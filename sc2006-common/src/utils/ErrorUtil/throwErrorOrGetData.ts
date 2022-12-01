import { PresentableError, ErrorUtil, defaultApiErrMessage } from '.';

type ErrorResponse = Response & {
	message?: string;
};

interface ThrowErrorOrGetDataOptions {
	fallbackTitle?: string;
	fallbackMessage?: string;
	responseNotNeeded?: boolean;
}

/*
	If a response is successful, simply return it
	Otherwise, extract the error message and return an PresentableError
*/
export async function throwErrorOrGetData<T>(
	response: ErrorResponse,
	options: ThrowErrorOrGetDataOptions = { responseNotNeeded: false },
): Promise<T> {
	const { status } = response;
	const data = await response.json();
	const { message, error } = data;
	const { responseNotNeeded, fallbackTitle, fallbackMessage } = options;
	if (status < 205 && !responseNotNeeded) {
		return data;
	}
	if (error.message) {
		throw ErrorUtil.apiError(error.message, error.title, error.level);
	} else {
		throw ErrorUtil.apiError(fallbackMessage, fallbackTitle);
	}
}
