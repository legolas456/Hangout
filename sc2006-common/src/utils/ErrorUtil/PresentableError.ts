export type PresentationLevel = 'info' | 'success' | 'warning' | 'error';

export interface PresentableErrorOptions {
	level: string;
	message: string;
	title: string;
}

export class PresentableError extends Error {
	readonly level: string;
	readonly title: string;
	constructor({ message, level, title }: PresentableErrorOptions) {
		super(message);
		this.level = level;
		this.title = title;
	}
}
