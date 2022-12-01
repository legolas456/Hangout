export class ArrayUtil {
	static replaceEmpty(arr: any[] | null | undefined, replacement = '-') {
		if (arr === null || arr === undefined || arr.length === 0) {
			return replacement;
		}
		return arr;
	}
}
