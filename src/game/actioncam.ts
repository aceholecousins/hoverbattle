import { Graphics } from "game/graphics/graphics";
import { vec3, mat3, mat4, vec2, quat } from "gl-matrix";
import { Camera, CameraConfig } from "game/graphics/camera";
import { mat3fromVectors } from "utilities/math_utils";
import { RigidBody } from "./physics/rigidbody";
import { copyIfPresent } from "utils";
import { LowPass } from "utilities/math_utils";

export class ActionCamConfig extends CameraConfig {
	/** camera will not move closer to scene than this */
	dMin = 5

	/** camera will make the image higher and wider than necessary by this factor */
	marginFactor = 1.33

	/** time constants for camera motion smoothing */
	tauXY = 1.5
	tauZ = 0.5

	/** time constant for camera focus point smoothing */
	tauFocus = 0.3

	constructor(config: Partial<ActionCamConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["dMin", "tauXY", "tauZ", "tauFocus", "marginFactor"])
	}
}

interface Target {
	position: vec2
}

interface Lock {
	target: Target
	radius: number
}

/*
The ActionCam tracks objects in the xy-plane from z
(so -z is the viewing direction).
*/

export class ActionCam {

	camera: Camera

	dMin: number

	positionX: LowPass
	positionY: LowPass
	positionZ: LowPass
	focusX: LowPass
	focusY: LowPass

	distanceOverWidth = 1
	distanceOverHeight = 1

	locks: Set<Lock> = new Set()

	constructor(
		graphics: Graphics,
		config: ActionCamConfig
	) {
		this.camera = graphics.camera.create(config)

		this.distanceOverHeight =
			0.5 / Math.tan(0.5 * config.verticalAngleOfViewInDeg / 180 * Math.PI) * config.marginFactor

		let cam = this
		this.camera.onAspectChange = function (aspect: number) {
			cam.distanceOverWidth = cam.distanceOverHeight / aspect
		}

		this.dMin = config.dMin

		const order = 3

		this.positionX = new LowPass(order, config.tauXY / order, 0)
		this.positionY = new LowPass(order, config.tauXY / order, 0)
		this.positionZ = new LowPass(order, config.tauZ / order, 100)

		this.focusX = new LowPass(order, config.tauFocus / order, 0)
		this.focusY = new LowPass(order, config.tauFocus / order, 0)
	}

	follow(target: Target, radius: number) {
		this.locks.add({ target, radius })
	}

	unfollow(target: Target) {
		for (let lock of this.locks) {
			if (lock.target === target) {
				this.locks.delete(lock)
			}
		}
	}

	update(dt: number) {
		let xMin = 1e12
		let xMax = -1e12
		let yMin = 1e12
		let yMax = -1e12
		for (let lock of this.locks) {
			xMin = Math.min(xMin, lock.target.position[0] - lock.radius)
			xMax = Math.max(xMax, lock.target.position[0] + lock.radius)
			yMin = Math.min(yMin, lock.target.position[1] - lock.radius)
			yMax = Math.max(yMax, lock.target.position[1] + lock.radius)
		}

		let target = vec3.fromValues(
			(xMin + xMax) / 2,
			(yMin + yMax) / 2,
			Math.max(
				(xMax - xMin) * this.distanceOverWidth,
				(yMax - yMin) * this.distanceOverHeight,
				this.dMin
			)
		)

		this.positionX.update(target[0], dt)
		this.positionY.update(target[1], dt)
		this.positionZ.update(target[2], dt)
		this.focusX.update(target[0], dt)
		this.focusY.update(target[1], dt)

		let z = vec3.fromValues(
			this.positionX.get() - this.focusX.get(),
			this.positionY.get() - this.focusY.get(),
			this.positionZ.get()
		)
		vec3.normalize(z, z)
		let y = vec3.fromValues(0, 1, 0)
		let x = vec3.cross(vec3.create(), y, z)
		vec3.normalize(x, x)
		vec3.cross(y, z, x)

		let ori = mat3fromVectors(mat3.create(), x, y, z)

		this.camera.position = vec3.fromValues(
			this.positionX.get(),
			this.positionY.get(),
			this.positionZ.get()
		)
		this.camera.orientation = quat.fromMat3(quat.create(), ori)
	}

}