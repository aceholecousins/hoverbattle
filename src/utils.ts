

export type Registry<T> = { [index: string]: T }

export function defaultTo<T>(parameter: T | undefined, defaultValue: T):T {
	return typeof(parameter) !== "undefined"? parameter : defaultValue
}

export interface Color{
	r:number
	g:number
	b:number
}