import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine } from "game/engine"
import { CircleConfig } from "game/physics/circle"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Player } from "game/player"
import { vec2, quat, vec3 } from "gl-matrix"
import { angleDelta, appendZ, quatFromAngle } from "utils/math"
import { Entity } from "../entity"
import { Powerup } from "game/entities/powerups/powerup"

export const GLIDER_RADIUS = 1
export const GLIDER_THRUST = 20
export const GLIDER_TURN_RATE = 20
export const GLIDER_DAMPING = 0.7
export const GLIDER_ANGULAR_DAMPING = 0.99

export class Glider extends Entity {
	public readyPowerups: Powerup[] = []
	public activatedPowerups: Powerup[] = []
	public onPressTrigger = () => { }
	public onReleaseTrigger = () => { }
	public onUpdate = (dt: number) => { }

	public maxThrust = GLIDER_THRUST
	public maxTurnRate = GLIDER_TURN_RATE

	private engine: Engine
	private holdsTrigger: boolean = false
	private requiresRelease: boolean = false
	private tNextRipple = 0

	constructor(
		public player: Player,
		position: vec2,
		model: Model,
		engine: Engine
	) {
		super()
		this.engine = engine
		this.body = engine.physics.addRigidBody(new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: 1 })],
			damping: GLIDER_DAMPING,
			angularDamping: GLIDER_ANGULAR_DAMPING
		}))
		this.body.setPosition(position)
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(GLIDER_RADIUS)
		this.mesh.setPositionZ(0.1)
		this.update(0)
	}

	update(dt: number) {
		let thrust = this.player.controller.getThrust() * this.maxThrust;
		this.body.applyLocalForce(vec2.fromValues(thrust, 0))

		const turnRate = this.player.controller.getTurnRate()
		if (turnRate != undefined) {
			this.body.applyTorque(turnRate * this.maxTurnRate)
		}
		const direction = this.player.controller.getAbsoluteDirection()
		if (direction != undefined) {
			this.turnToDirection(direction)
		}

		if (this.player.controller.isShooting() && !this.holdsTrigger) {
			this.holdsTrigger = true
			this.onPressTrigger()
		}
		else if (!this.player.controller.isShooting() && this.holdsTrigger) {
			this.holdsTrigger = false
			this.requiresRelease = false
			this.onReleaseTrigger()
		}

		this.mesh.copy2dPose(this.body)

		this.tNextRipple -= dt
		if (this.tNextRipple < 0) {
			this.tNextRipple = 0.03
			let v = vec2.length(this.body.getVelocity())
			this.engine.graphics.water.makeRipple(
				appendZ(this.body.getPosition(), 0),
				Math.min(v / 10, 3),
				1.0
			)
		}

		this.onUpdate(dt)
	}

	isFiring() { return this.holdsTrigger && !this.requiresRelease }
	requireTriggerRelease() { this.requiresRelease = true }

	turnToDirection(direction: number) {
		let delta = angleDelta(direction, this.body.getAngle());
		let threshold = 0.0001;
		if (Math.abs(delta) > threshold) {
			let sign = Math.sign(delta)
			this.body.applyAngularMomentum(-sign * 0.3)
		}
	}
}


export async function createGliderFactory(engine: Engine) {

	let { model, meta } = await engine.graphics.loadModel(
		"assets/models/glider7.glb")

	return function (player: Player, position: vec2) {
		return new Glider(
			player,
			position,
			model,
			engine
		)
	}
}
