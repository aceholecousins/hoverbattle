import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine } from "game/engine"
import { CircleConfig } from "game/physics/circle"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { vec2, vec3, quat } from "gl-matrix"
import { Entity } from "game/entities/entity"

const POWERUP_BOX_SIZE = 1.8

export type PowerupKind = "laser" | "mine" | "missile" | "nashwan" | "repair" | "shield"

export interface Powerup {
	readonly kind: string
}

export class PowerupBox extends Entity {
	time: number = 0

	constructor(
		public kind: PowerupKind,
		position: vec2,
		model: Model,
		engine: Engine
	) {
		super()

		this.body = engine.physics.addRigidBody(new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: POWERUP_BOX_SIZE * 0.6 })],
			damping: 0.5,
			angularDamping: 0.5
		}))
		this.body.position = position
		this.body.angle = Math.random() * Math.PI * 2
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(POWERUP_BOX_SIZE, POWERUP_BOX_SIZE, POWERUP_BOX_SIZE)
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
		this.mesh.orientation = quat.fromEuler(
			quat.create(),
			20 * Math.sin(this.time),
			17 * Math.sin(1.1337 * this.time),
			this.body.angle / Math.PI * 180
		)
	}
}


export async function createPowerupBoxFactory(engine: Engine) {

	let [laser, mine, missile, nashwan, repair, shield] = await Promise.all([
		engine.graphics.loadModel("assets/models/lasercrate.glb"),
		engine.graphics.loadModel("assets/models/minecrate.glb"),
		engine.graphics.loadModel("assets/models/missilecrate.glb"),
		engine.graphics.loadModel("assets/models/nashwancrate.glb"),
		engine.graphics.loadModel("assets/models/repaircrate.glb"),
		engine.graphics.loadModel("assets/models/powershieldcrate.glb")
	])
	let models = { laser, mine, missile, nashwan, repair, shield }

	return function (kind: PowerupKind, position: vec2) {
		return new PowerupBox(
			kind,
			position,
			models[kind].model,
			engine
		)
	}
}
