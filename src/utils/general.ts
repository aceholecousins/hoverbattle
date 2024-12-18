
export type Registry<T> = { [index: string]: T }

export type Kind = string

// https://stackoverflow.com/a/49579497/3825996
type OptionalKeys<T> = { [K in keyof T]-?:
	({} extends { [P in K]: T[K] } ? K : never)
}[keyof T]

export type Optionals<T> = Required<Pick<T, OptionalKeys<T>>>

export function copy<T1, T2, K extends keyof T1 & keyof T2>(
	target: T1, source: T2, keys: K[]) {

	for (const k of keys) {
		(target as any)[k] = (source as any)[k]
	}
}

export function copyIfPresent<T1 extends object, T2 extends object, K extends keyof T1 & keyof T2>(
	target: T1, source: T2, keys: K[]) {

	for (const k of keys) {
		if (k in source) {
			(target as any)[k] = (source as any)[k]
		}
	}
}

export function remove<T>(a: Array<T>, b: T) {
	let index = a.indexOf(b);
	if (index >= 0) {
		a.splice(index, 1);
	}
}

export type AwaitedFields<T> = {
	[K in keyof T]: T[K] extends Promise<infer U> ? U : never;
};

// await all fields of an object
export async function promiseAllFields<T extends Record<string, Promise<any>>>(obj: T): Promise<AwaitedFields<T>> {
	const keys = Object.keys(obj) as Array<keyof T>;
	const values = await Promise.all(keys.map(key => obj[key]));
	const result = {} as AwaitedFields<T>;
	keys.forEach((key, index) => {
		(result[key] as any) = values[index];
	});
	return result;
}

export function memoize<T, Args extends any[]>(
	fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<T> {
	let cache: T | null = null
	let cacheArgs: Args | null = null
	return async function (...args: Args) {
		if (!cache || !cacheArgs || !args.every((arg, index) => arg === cacheArgs![index])) {
			cache = await fn(...args)
			cacheArgs = args
		}
		return cache
	}
}
