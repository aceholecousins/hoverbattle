import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine } from "game/engine"
import { CircleConfig } from "game/physics/circle"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Player } from "game/player"
import { vec2, quat, vec3 } from "gl-matrix"
import { wrapAngle } from "utilities/math_utils"
import { Entity } from "../entity"
import { Powerup } from "../powerup"

export const GLIDER_RADIUS = 1;

export class Glider extends Entity {
	public readyPowerups: Powerup[] = []
	public activatedPowerups: Powerup[] = []
	public onPressTrigger = () => { }
	public onReleaseTrigger = () => { }
	public onUpdate = () => { }

	private holdsTrigger: boolean = false
	private requiresRelease: boolean = false

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
			damping: 0.7,
			angularDamping: 0.99
		}))
		this.body.position = position
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(GLIDER_RADIUS, GLIDER_RADIUS, GLIDER_RADIUS)
		this.update(0)
	}

	update(dt: number) {
		let thrust = this.player.controller.getThrust() * 20;
		this.body.applyLocalForce(vec2.fromValues(thrust, 0))

		const turnRate = this.player.controller.getTurnRate()
		if (turnRate != undefined) {
			this.body.applyTorque(turnRate * 20)
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

		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
		this.mesh.orientation = quat.fromEuler(
			quat.create(), 0, 0, this.body.angle / Math.PI * 180)

		this.onUpdate()
	}

	isFiring() { return this.holdsTrigger && !this.requiresRelease }
	requireTriggerRelease() { this.requiresRelease = true }

	turnToDirection(direction: number) {
		let wrappedAngle = wrapAngle(this.body.angle);
		let directionDiff = wrapAngle(wrappedAngle - direction);
		let threshold = 0.0001;
		if (Math.abs(directionDiff) > threshold) {
			let sign = Math.sign(directionDiff)
			this.body.applyAngularMomentum(-sign * 0.3)
		}
	}
}


export async function createGliderFactory(engine: Engine) {

	let { model, meta } = await engine.graphics.loadModel(
		"game/entities/glider/glider7.glb")

	return function (player: Player, position: vec2) {
		return new Glider(
			player,
			position,
			model,
			engine
		)
	}
}
