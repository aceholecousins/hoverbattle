
export interface Circle{
	kind:"circle"
	radius:number
}

export interface Rectangle{
	kind:"rectangle"
	width:number
	height:number
}

export type Shape = Circle | Rectangle