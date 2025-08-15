import { ModelMeshConfig } from "game/graphics/mesh"
import { Model, ModelMetaData } from "game/graphics/asset"
import { Engine } from "game/engine"
import { Circle, Triangle } from "game/physics/shapes"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Player } from "game/player"
import { angleDelta, appendZ, LowPass, triangle3to2, Vector2, Triangle3, ypr } from "math"
import { Vehicle, VEHICLE_RADIUS, VehicleFactory } from "game/entities/vehicles/vehicle"
import { Entity } from "game/entities/entity"

export const GLIDER_THRUST = 20
export const GLIDER_TURN_RATE = 20
export const GLIDER_DAMPING = 1.2 // these values have not been fine-tuned, they were converted from decay rates
export const GLIDER_ANGULAR_DAMPING = 4.6

export class Glider extends Vehicle {

	public maxThrust = GLIDER_THRUST
	public maxTurnRate = GLIDER_TURN_RATE

	private engine: Engine
	private tNextRipple = 0

	private roll: LowPass = new LowPass(1, 0.3, 0)

	constructor(
		player: Player,
		position: Vector2,
		model: Model,
		meta: ModelMetaData,
		engine: Engine
	) {

		let triangles: Triangle[] = []
		for (let tri of (meta.collision as Triangle3[])) {
			triangles.push(new Triangle(triangle3to2(tri)))
		}

		let createBody = (self: Entity) => {
			let body = engine.physics.addRigidBody({
				actor: self,
				// shapes: triangles,
				shapes: [new Circle(VEHICLE_RADIUS)],
				damping: GLIDER_DAMPING,
				angularDamping: GLIDER_ANGULAR_DAMPING
			})
			body.setPosition(position)
			return body
		}

		let createMesh = (self: Entity) => {
			let mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
			mesh.setScale(VEHICLE_RADIUS)
			mesh.setPositionZ(0.5)
			return mesh
		}

		super(player, createBody, createMesh);

		this.engine = engine
		this.update(0)
	}

	update(dt: number) {
		let thrust = this.player.controller.getThrust() * this.maxThrust;
		this.body.applyLocalForce(new Vector2(thrust, 0))

		const turnRate = this.player.controller.getTurnRate()
		if (turnRate != undefined) {
			this.body.applyTorque(turnRate * this.maxTurnRate)
		}
		const direction = this.player.controller.getAbsoluteDirection()
		if (direction != undefined) {
			this.turnToDirection(direction)
		}

		this.mesh.copy2dPose(this.body)

		this.mesh.setPositionXY(this.body.getPosition())
		this.roll.update(this.body.getAngularVelocity() * -7, dt)
		// let roll = this.roll.get()
		let roll = 0
		this.mesh.setOrientation(ypr(this.body.getAngle(), 0, roll))

		this.tNextRipple -= dt
		if (this.tNextRipple < 0) {
			this.tNextRipple = 0.03
			let v = this.body.getVelocity().length()
			this.engine.graphics.water.makeRipple(
				appendZ(this.body.getPosition(), 0),
				Math.min(v / 10, 3),
				1.0
			)
		}

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


export async function createGliderFactory(engine: Engine): Promise<VehicleFactory> {

	let { model, meta } = await engine.graphics.loadModel(
		"assets/models/glider8_halo.glb")

	return function (player: Player, position: Vector2) {
		return new Glider(
			player,
			position,
			model,
			meta,
			engine
		)
	}
}
