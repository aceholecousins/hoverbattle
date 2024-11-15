import { vec2, vec3, mat3, quat, ReadonlyVec2, ReadonlyVec3 } from "gl-matrix";

export function angleDelta(from: number, to: number): number {
	let diff = (to - from) % (2 * Math.PI);
	if (diff > Math.PI) diff -= 2 * Math.PI;
	if (diff < -Math.PI) diff += 2 * Math.PI;;
	return diff;
}

export function mat3fromVectors(out: mat3, x: ReadonlyVec3, y: ReadonlyVec3, z: ReadonlyVec3) {
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

export function quatFromAngle(angle: number) {
	return quat.fromEuler(quat.create(), 0, 0, angle / Math.PI * 180)
}

export function appendZ(v: ReadonlyVec2, z: number) {
	return vec3.fromValues(v[0], v[1], z)
}