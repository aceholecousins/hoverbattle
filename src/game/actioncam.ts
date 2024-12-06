import { Graphics } from "game/graphics/graphics";
import { Vector2, Vector3, quatFromMatrix3 } from "math";
import { Camera, CameraConfig } from "game/graphics/camera";
import { matrix3FromBasis } from "math";
import { copyIfPresent } from "utils/general";
import { LowPass } from "math";

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
	getPosition(): Vector2
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

		this.distanceOverHeight =
			0.5 / Math.tan(0.5 * config.verticalAngleOfViewInDeg / 180 * Math.PI) * config.marginFactor

		let cam = this

		let oldAspectChange = config.onAspectChange
		config.onAspectChange = function (aspect: number) {
			cam.distanceOverWidth = cam.distanceOverHeight / aspect
			oldAspectChange(aspect)
		}

		this.camera = graphics.camera.create(config)

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
			xMin = Math.min(xMin, lock.target.getPosition().x - lock.radius)
			xMax = Math.max(xMax, lock.target.getPosition().x + lock.radius)
			yMin = Math.min(yMin, lock.target.getPosition().y - lock.radius)
			yMax = Math.max(yMax, lock.target.getPosition().y + lock.radius)
		}

		let targetCenter = new Vector3(
			(xMin + xMax) / 2,
			(yMin + yMax) / 2,
			Math.max(
				(xMax - xMin) * this.distanceOverWidth,
				(yMax - yMin) * this.distanceOverHeight,
				this.dMin
			)
		)

		this.positionX.update(targetCenter.x, dt)
		this.positionY.update(targetCenter.y, dt)
		this.positionZ.update(targetCenter.z, dt)
		this.focusX.update(targetCenter.x, dt)
		this.focusY.update(targetCenter.y, dt)

		let z = new Vector3(
			this.positionX.get() - this.focusX.get(),
			this.positionY.get() - this.focusY.get(),
			this.positionZ.get()
		)
		z.normalize()
		let y = new Vector3(0, 1, 0)
		let x = y.cross(z).normalize()
		y = z.cross(x)

		let ori = matrix3FromBasis(x, y, z)

		this.camera.setPosition(new Vector3(
			this.positionX.get(),
			this.positionY.get(),
			this.positionZ.get()
		))
		this.camera.setOrientation(quatFromMatrix3(ori))
	}

}