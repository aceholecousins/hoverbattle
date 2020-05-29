
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