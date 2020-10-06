import { Graphics } from "domain/graphics/graphics";
import { vec3, mat3, mat4, vec2, quat} from "gl-matrix";
import { Camera, CameraConfig } from "domain/graphics/camera";
import { mat3fromVectors } from "utilities/math_utils";
import { RigidBody } from "./physics/rigidbody";
import { copyIfPresent } from "utils";

export class ActionCamConfig extends CameraConfig{
	/** camera will not move closer to scene than this */
	dMin = 5

	/** camera will make the image higher and wider than necessary by this factor */
	marginFactor = 1.5

	/** time constant for camera position smoothing */
	tauCam = 0.2

	/** time constant for camera focus point smoothing */
	tauFocus = 0.1

	constructor(config:Partial<ActionCamConfig> = {}){
		super(config)
		copyIfPresent(this, config, ["dMin", "tauCam", "tauFocus", "marginFactor"])
	}	
}

interface Lock{
	body:RigidBody
	radius:number
}

/*
The ActionCam tracks objects in the xy-plane from z
(so -z is the viewing direction).
*/

export class ActionCam{

	camera:Camera

	dMin:number
	tauCam:number
	tauFocus:number

	distanceOverWidth = 1
	distanceOverHeight = 1

	currentPosition:vec3
	currentFocus:vec3

	locks:Set<Lock> = new Set()

	constructor(
		graphics:Graphics,
		config:ActionCamConfig
	){
		this.camera = graphics.camera.create(config)

		this.distanceOverHeight =
			0.5 / Math.tan(0.5 * config.verticalAngleOfViewInDeg/180*Math.PI) * config.marginFactor

		let cam = this
		this.camera.onAspectChange = function(aspect:number){
			cam.distanceOverWidth = cam.distanceOverHeight / aspect
		}

		this.dMin = config.dMin
		this.tauCam = config.tauCam
		this.tauFocus = config.tauFocus

		this.currentPosition = config.position
		this.currentFocus = vec3.fromValues(0, 0, 0)
	}

	follow(body:RigidBody, radius:number){
		this.locks.add({body, radius})
	}

	unfollow(body:RigidBody){
		for(let lock of this.locks){
			if(lock.body === body){
				this.locks.delete(lock)
			}
		}
	}

	update(dt:number){
		let xMin = 1e12
		let xMax = -1e12
		let yMin = 1e12
		let yMax = -1e12
		for(let lock of this.locks){
			xMin = Math.min(xMin, lock.body.position[0] - lock.radius)
			xMax = Math.max(xMax, lock.body.position[0] + lock.radius)
			yMin = Math.min(yMin, lock.body.position[1] - lock.radius)
			yMax = Math.max(yMax, lock.body.position[1] + lock.radius)
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

		let kCam = Math.exp(-dt/this.tauCam)
		let kFocus = Math.exp(-dt/this.tauFocus)
		
		vec3.lerp(this.currentPosition, target, this.currentPosition, kCam)
		target[2] = 0
		vec3.lerp(this.currentFocus, target, this.currentFocus, kFocus)

		let z = vec3.subtract(vec3.create(), this.currentPosition, this.currentFocus)
		vec3.normalize(z, z)
		let y = vec3.fromValues(0, 1, 0)
		let x = vec3.cross(vec3.create(), y, z)
		vec3.normalize(x, x)
		vec3.cross(y, z, x)

		let ori = mat3fromVectors(mat3.create(), x, y, z)
		
		this.camera.position = this.currentPosition
		this.camera.orientation = quat.fromMat3(quat.create(), ori)
	}

}