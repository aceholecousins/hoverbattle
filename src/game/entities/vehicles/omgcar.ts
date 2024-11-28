import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine } from "game/engine"
import { CircleConfig } from "game/physics/circle"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Player } from "game/player"
import { vec2, quat } from "gl-matrix"
import { Ramper, LowPass } from "utils/math"
import { angleDelta } from "utils/math"
import { Vehicle, VEHICLE_RADIUS, VehicleFactory } from "game/entities/vehicles/vehicle"

export const CAR_ACCELERATION = 50
export const CAR_MAX_SPEED = 15
export const CAR_DRAG = 0.5
export const CAR_TURN_RATE = 20 * Math.PI / 180
export const CAR_TRACTION = 1

export class OmgCar extends Vehicle {

	private softTurnRate = new Ramper(10, 0)

	constructor(
		public player: Player,
		position: vec2,
		model: Model,
		engine: Engine
	) {
		super()
		this.body = engine.physics.addRigidBody(new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: 1 })],
			damping: CAR_DRAG,
			angularDamping: 0
		}))
		this.body.setPosition(position)
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(VEHICLE_RADIUS)
		this.mesh.setPositionZ(0.5)
		this.update(0)
	}

	update(dt: number) {

		const f = CAR_ACCELERATION * this.body.getMass() * this.player.controller.getThrust()
		let v = vec2.length(this.body.getVelocity())

		if (v > CAR_MAX_SPEED) {
			this.body.setVelocity(vec2.scale(vec2.create(), this.body.getVelocity(), CAR_MAX_SPEED / v))
			v = CAR_MAX_SPEED
		}

		this.body.applyLocalForce(vec2.fromValues(f, 0))

		const turnRate = this.player.controller.getTurnRate()
		if (turnRate != undefined) {
			// this.softTurnRate.update(turnRate, dt)
			// this.body.setAngularVelocity(this.softTurnRate.get() * CAR_TURN_RATE * v)
			this.body.setAngularVelocity(turnRate * CAR_TURN_RATE * v)
		}
		const direction = this.player.controller.getAbsoluteDirection()
		if (direction != undefined) {
			this.turnToDirection(direction)
		}

		let lookAtDirection = vec2.fromValues(
			Math.cos(this.body.getAngle()),
			Math.sin(this.body.getAngle())
		)
		let motionDirection = vec2.normalize(vec2.create(), this.body.getVelocity())

		let lerped = vec2.lerp(vec2.create(), motionDirection, lookAtDirection, CAR_TRACTION * dt)
		vec2.scale(lerped, lerped, v)

		this.body.setVelocity(lerped)

		this.mesh.copy2dPose(this.body)

		this.mesh.setPositionXY(this.body.getPosition())
		this.mesh.setOrientation(quat.fromEuler(
			quat.create(), 0, 0, this.body.getAngle() / Math.PI * 180))

		super.update(dt)
		this.onUpdate(dt)
	}

	turnToDirection(direction: number) {
		let delta = angleDelta(direction, this.body.getAngle());
		let threshold = 0.0001;
		if (Math.abs(delta) > threshold) {
			let sign = Math.sign(delta)
			this.body.applyAngularMomentum(-sign * 0.3)
		}
	}
}


export async function createOmgCarFactory(engine: Engine): Promise<VehicleFactory> {

	let { model, meta } = await engine.graphics.loadModel(
		"assets/models/car.glb")

	return function (player: Player, position: vec2) {
		return new OmgCar(
			player,
			position,
			model,
			engine
		)
	}
}
