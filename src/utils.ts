
export type Registry<T> = { [index: string]: T }

export interface Color{
	r:number
	g:number
	b:number
}

export type Kind = string

// https://stackoverflow.com/a/49579497/3825996
type OptionalKeys<T> = { [K in keyof T]-?:
  ({} extends { [P in K]: T[K] } ? K : never)
}[keyof T]

export type Optionals<T> = Required<Pick<T, OptionalKeys<T>>>

export function copy<T1, T2, K extends keyof T1 & keyof T2>(
	target:T1, source:T2, keys:K[]){

	for(const k of keys){
		(target as any)[k] = (source as any)[k]
	}
}

export function copyIfPresent<T1, T2, K extends keyof T1 & keyof T2>(
	target:T1, source:T2, keys:K[]){

	for(const k of keys){
		if(k in source){
			(target as any)[k] = (source as any)[k]
		}
	}
}