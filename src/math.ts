import { Vector2, Vector3, Matrix3, Matrix4, Quaternion, Euler } from 'three'
export { Vector2, Vector3, Matrix3, Matrix4, Quaternion, Euler } from 'three'

export const DEG = Math.PI / 180

export function angleDelta(from: number, to: number): number {
	let diff = (to - from) % (2 * Math.PI);
	if (diff > Math.PI) diff -= 2 * Math.PI;
	if (diff < -Math.PI) diff += 2 * Math.PI;;
	return diff;
}

export function matrix3FromBasis(x: Vector3, y: Vector3, z: Vector3) {
	return new Matrix3(
		x.x, y.x, z.x,
		x.y, y.y, z.y,
		x.z, y.z, z.z
	)
}

export type Triangle2 = [Vector2, Vector2, Vector2]
export type Triangle3 = [Vector3, Vector3, Vector3]

export function triangle3to2(tri: Triangle3): Triangle2 {
	return [
		new Vector2(tri[0].x, tri[0].y),
		new Vector2(tri[1].x, tri[1].y),
		new Vector2(tri[2].x, tri[2].y)
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

export class Ramper {
	private state: number

	constructor(
		public changeRate: number,
		initialValue: number
	) {
		this.state = initialValue
	}

	update(input: number, dt: number) {
		let delta = input - this.state
		if (Math.abs(delta) < this.changeRate * dt) {
			this.state = input
		} else {
			this.state += Math.sign(delta) * this.changeRate * dt
		}
	}

	get() {
		return this.state
	}
}

export function quatFromAngle(angle: number) {
	new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), angle)
	return new Quaternion(0, 0, Math.sin(angle / 2), Math.cos(angle / 2))
}

export function ypr(yaw: number, pitch: number, roll: number): Quaternion {
	// note "ZYX" is only order of application (intrinsic), not order of arguments
	return new Quaternion().setFromEuler(new Euler(roll, pitch, yaw, "ZYX"))
}

export function quatFromMatrix3(m: Matrix3) {
	return new Quaternion().setFromRotationMatrix(new Matrix4().setFromMatrix3(m))
}

export function appendZ(v: Vector2, z: number) {
	return new Vector3(v.x, v.y, z)
}

export function vec2FromDir(dir: number) {
	return new Vector2(Math.cos(dir), Math.sin(dir))
}

export function decayRateFromDamping(damping: number): number {
	// input: damping coefficient k such that a = -k * v
	// output: fraction of velocity that is lost after 1s
	return 1.0 - Math.exp(-damping)
}

export function dampingFromDecayRate(decayRate: number): number {
	// input: fraction of velocity that is lost after 1s
	// output: damping coefficient k such that a = -k * v
	if (decayRate <= 0 || decayRate >= 1) {
		throw new Error("Decay rate must be in (0, 1)")
	}
	return -Math.log(1 - decayRate)
}