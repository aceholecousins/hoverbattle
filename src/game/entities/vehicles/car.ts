import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine, getEngine } from "game/engine"
import { Circle } from "game/physics/shapes"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Player } from "game/player"
import { Vector2, ypr, vec2FromDir, DEG } from "math"
import { Ramper, LowPass } from "math"
import { angleDelta } from "math"
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle"
import { Entity } from "game/entities/entity"
import { Resource } from "game/resourcemanager"

export const CAR_THRUST = 15
export const CAR_TURN_RATE = 0.3
export const CAR_LONGITUDINAL_VELOCITY_DECAY = 0.3
export const CAR_LATERAL_VELOCITY_DECAY = 0.95

export class Car extends Vehicle {

	public maxThrust = CAR_THRUST
	public maxTurnRate = CAR_TURN_RATE

	private softTurnRate = new Ramper(4, 0)
	private roll = new LowPass(1, 0.1, 0)

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
				damping: 0,
				angularDamping: 0
			})
			body.setPosition(position)
			return body
		}
		let createMesh = (self: Entity) => {
			let mesh = getEngine().graphics.mesh.createFromModel({ model: Car.model.get().model })
			mesh.setScale(VEHICLE_RADIUS)
			mesh.setPositionZ(0.5)
			return mesh
		}

		super(player, createBody, createMesh);

		this.update(0)
	}

	update(dt: number) {

		let v = this.body.getVelocity();
		let forward = vec2FromDir(this.body.getAngle())
		let right = new Vector2(-forward.y, forward.x);
		let vForward = v.dot(forward);
		let vRight = v.dot(right);
		let vForwardDamped = vForward * Math.pow(1.0 - CAR_LONGITUDINAL_VELOCITY_DECAY, dt);
		let vRightDamped = vRight * Math.pow(1.0 - CAR_LATERAL_VELOCITY_DECAY, dt);
		let vDamped = new Vector2()
			.addScaledVector(forward, vForwardDamped)
			.addScaledVector(right, vRightDamped)
		this.body.setVelocity(vDamped)

		let thrust = this.player.controller.getThrust() * this.maxThrust;
		this.body.applyLocalForce(new Vector2(thrust, 0))

		const turnRate = this.player.controller.getTurnRate()
		if (turnRate != undefined) {
			this.softTurnRate.update(turnRate, dt)
			this.body.setAngularVelocity(this.softTurnRate.get() * this.maxTurnRate * vForward)
		}
		const direction = this.player.controller.getAbsoluteDirection()
		if (direction != undefined) {
			this.turnToDirection(direction)
		}

		this.mesh.copy2dPose(this.body)

		this.mesh.setPositionXY(this.body.getPosition())
		this.roll.update(vRightDamped * -2 * DEG, dt)
		this.roll.update(0, dt)
		this.mesh.setOrientation(ypr(
			this.body.getAngle(), 0, this.roll.get(),
		))

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
