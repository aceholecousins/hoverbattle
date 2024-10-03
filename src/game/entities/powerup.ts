import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/model"
import { Engine } from "game/match"
import { CircleConfig } from "game/physics/circle"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { quat, vec3 } from "gl-matrix"
import { Entity } from "./entity"

const POWERUP_BOX_SIZE = 1

export interface Powerup {
	readonly kind: string
}

export class PowerupBox extends Entity {
	time: number = 0

	constructor(
		public kind: string,
		engine: Engine,
		bodyCfg: RigidBodyConfig,
		modelCfg: ModelMeshConfig,
	) {
		super()
		bodyCfg.actor = this
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.mesh = engine.graphics.mesh.createFromModel(modelCfg)
		this.mesh.scaling = vec3.fromValues(POWERUP_BOX_SIZE, POWERUP_BOX_SIZE, POWERUP_BOX_SIZE)
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

	let powerupBoxAsset: Model

	await new Promise((resolve, reject) => {
		powerupBoxAsset = engine.graphics.model.load(
			"game/entities/crate.glb", resolve, reject)
	})

	const powerupBoxBodyCfg = new RigidBodyConfig({
		actor: null, // will be filled by the constructed box
		shapes: [new CircleConfig({ radius: POWERUP_BOX_SIZE * 0.6 })],
		damping: 0.5,
		angularDamping: 0.5
	})

	const powerupBoxModelCfg: ModelMeshConfig = new ModelMeshConfig({
		asset: powerupBoxAsset
	})

	return function (kind: string) {
		return new PowerupBox(
			kind,
			engine,
			powerupBoxBodyCfg,
			powerupBoxModelCfg
		)
	}
}
