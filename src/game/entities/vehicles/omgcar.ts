import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine, getEngine } from "game/engine"
import { Circle } from "game/physics/shapes"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Player } from "game/player"
import { Ramper, LowPass } from "math"
import { angleDelta, Vector2, ypr } from "math"
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle"
import { Entity } from "game/entities/entity"
import { Resource } from "game/resourcemanager"

export const CAR_ACCELERATION = 50
export const CAR_MAX_SPEED = 15
export const CAR_DRAG = 0.7
export const CAR_TURN_RATE = 20 * Math.PI / 180
export const CAR_TRACTION = 1

export class OmgCar extends Vehicle {
	// https://www.youtube.com/watch?v=BSybcKPQCnc

	private softTurnRate = new Ramper(10, 0)

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/car.glb")
	)

	constructor(
		player: Player,
		position: Vector2
	) {
		let createBody = (self: Entity) => {
			let body = getEngine().physics.addRigidBody({
				actor: self,
				shapes: [new Circle(1)],
				damping: CAR_DRAG,
				angularDamping: 0
			})
			body.setPosition(position)
			return body
		}
		let createMesh = (self: Entity) => {
			let mesh = getEngine().graphics.mesh.createFromModel({ model: OmgCar.model.get().model })
			mesh.setScale(VEHICLE_RADIUS)
			mesh.setPositionZ(0.5)
			return mesh
		}

		super(player, createBody, createMesh);

		this.update(0)
	}

	update(dt: number) {

		const f = CAR_ACCELERATION * this.body.getMass() * this.player.controller.getThrust()
		let v = this.body.getVelocity().length()

		if (v > CAR_MAX_SPEED) {
			this.body.setVelocity(
				this.body.getVelocity().clone().setLength(CAR_MAX_SPEED)
			);
			v = CAR_MAX_SPEED
		}

		this.body.applyLocalForce(new Vector2(f, 0))

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

		let lookAtDirection = new Vector2(
			Math.cos(this.body.getAngle()),
			Math.sin(this.body.getAngle())
		)
		let motionDirection = this.body.getVelocity().clone().normalize()

		let lerped = motionDirection.lerp(lookAtDirection, CAR_TRACTION * dt).setLength(v)
		this.body.setVelocity(lerped)

		this.mesh.copy2dPose(this.body)

		this.mesh.copy2dPose(this.body)

		super.update(dt)
		this.onUpdate(dt)
	}

	turnToDirection(direction: number) {
		let delta = angleDelta(direction, this.body.getAngle());
		let threshold = 0.0001;
		if (Math.abs(delta) > threshold) {
			let sign = Math.sign(delta)
			this.body.applyAngularImpulse(-sign * 0.3)
		}
	}
}
