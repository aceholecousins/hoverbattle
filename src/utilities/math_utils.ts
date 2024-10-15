import { vec3, mat3, vec2 } from "gl-matrix";

/**
 * Wraps an angle in order to be in the limits of the wrapping point.
 * 
 * @param angle Angle to be wrapped in rad
 * @param wrapAt Wrapping point. Defaults to Math.PI
 * 
 * @returns the wrapped angle in the range between [wrapAt-2pi, wrapAt)
 */
export function wrapAngle(angle: number, wrapAt = Math.PI): number {
	let revs = (angle - wrapAt) / 2.0 / Math.PI;
	return (revs - Math.floor(revs) - 1) * 2.0 * Math.PI + wrapAt
}

export function mat3fromVectors(out: mat3, x: vec3, y: vec3, z: vec3) {
	// note that matrices are stored column-wise

	out[0] = x[0]
	out[1] = x[1]
	out[2] = x[2]

	out[3] = y[0]
	out[4] = y[1]
	out[5] = y[2]

	out[6] = z[0]
	out[7] = z[1]
	out[8] = z[2]

	return out
}

export type Triangle2 = [vec2, vec2, vec2]
export type Triangle3 = [vec3, vec3, vec3]

export function triangle3to2(tri: Triangle3) {
	return [
		vec2.fromValues(tri[0][0], tri[0][1]),
		vec2.fromValues(tri[1][0], tri[1][1]),
		vec2.fromValues(tri[2][0], tri[2][1])
	]
}

export class LowPass {
	private state: number[]
	
	constructor(
		order: number,
		public tau: number,
		initialValue: number
	) {
		this.state = Array(order).fill(initialValue);
	}

	update(input: number, dt: number) {
		const k = Math.exp(-dt / this.tau)
		this.state[0] = k * this.state[0] + (1 - k) * input
		for (let i = 1; i < this.state.length; i++) {
			this.state[i] = k * this.state[i] + (1 - k) * this.state[i - 1]
		}
	}

	get() {
		return this.state[this.state.length - 1]
	}
}