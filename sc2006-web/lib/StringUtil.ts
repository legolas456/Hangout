export class StringUtil {
	static replaceEmpty(str: string | null | undefined, replacement = '-') {
		if (str === null || str === undefined || str.length === 0) {
			return replacement;
		}
		return str;
	}
}
