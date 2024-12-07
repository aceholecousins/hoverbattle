import { ModelMeshConfig } from "game/graphics/mesh"
import { Model, ModelMetaData } from "game/graphics/asset"
import { Engine } from "game/engine"
import { CircleConfig } from "game/physics/circle"
import { TriangleConfig } from "game/physics/triangle"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Player } from "game/player"
import { angleDelta, appendZ, LowPass, triangle3to2, Vector2, Triangle3, ypr } from "math"
import { Vehicle, VEHICLE_RADIUS, VehicleFactory } from "game/entities/vehicles/vehicle"

export const GLIDER_THRUST = 20
export const GLIDER_TURN_RATE = 20
export const GLIDER_DAMPING = 0.7
export const GLIDER_ANGULAR_DAMPING = 0.99

export class Glider extends Vehicle {

	public maxThrust = GLIDER_THRUST
	public maxTurnRate = GLIDER_TURN_RATE

	private engine: Engine
	private tNextRipple = 0

	private roll:LowPass = new LowPass(1, 0.3, 0)

	constructor(
		public player: Player,
		position: Vector2,
		model: Model,
		meta: ModelMetaData,
		engine: Engine
	) {
		super()
		this.engine = engine

		let triangles: TriangleConfig[] = []
		for (let tri of (meta.collision as Triangle3[])) {
			triangles.push(new TriangleConfig({ corners: triangle3to2(tri) }))
		}

		this.body = engine.physics.addRigidBody(new RigidBodyConfig({
			actor: this,
			// shapes: triangles,
			shapes: [new CircleConfig({ radius: 1 })],
			damping: GLIDER_DAMPING,
			angularDamping: GLIDER_ANGULAR_DAMPING
		}))
		this.body.setPosition(position)
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(VEHICLE_RADIUS)
		this.mesh.setPositionZ(0.5)
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
			this.body.applyAngularMomentum(-sign * 0.3)
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
