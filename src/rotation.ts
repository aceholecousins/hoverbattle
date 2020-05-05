import { Euler } from "three"

export class Rotation {
	x:number
	y:number
	z:number

	constructor(rotation:Euler) {
		this.x = rotation.x
		this.y = rotation.y
		this.z = rotation.z
	}
}