export class StringUtil {
	static replaceEmpty(str: string | null | undefined, replacement = '-') {
		if (str === null || str === undefined || str === '') {
			return replacement;
		}
		return str;
	}
}
