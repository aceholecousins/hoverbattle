import { vec3 } from 'gl-matrix'

export interface Water {
	makeRipple(position: vec3, size:number, strength: number): void
}