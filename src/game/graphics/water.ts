import { Vector3 } from 'math'

export interface Water {
	makeRipple(position: Vector3, size:number, strength: number): void
}