
export type Registry<T> = { [index: string]: T }

// export type Kind = string

// Defaults<T> extracts all optional properties and makes them required,
// in order to define default values for them.
//*
// this works only in strict mode ("strict": true in tsconfig.json):
export type Defaults<T> = { [K in keyof T as undefined extends T[K] ? K : never]-?: T[K]; };
/*/
// this works only in non-strict mode:
type OptionalKeys<T> = {
	[K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

export type Defaults<T> = Required<Pick<T, OptionalKeys<T>>>
/**/


export function assertDefined<T>(
	value: T,
	message?: string
): asserts value is NonNullable<T> {
	if (value === undefined || value === null) {
		throw new Error(message ?? 'Value must be defined')
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
