import {Shape, Circle, Rectangle} from "../shapes.js"

export class P2Circle implements Circle{
	kind:"circle"
	radius:number
}

export class P2Rectangle implements Rectangle{
	kind:"rectangle"
	width:number
	height:number
}

export type P2Shape = P2Circle | P2Rectangle