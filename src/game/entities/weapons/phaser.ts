import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/model";
import { Engine } from "game/match";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { quat, vec2 } from "gl-matrix";
import { assignRole, Role } from "../actor";
import { Entity } from "../entity";
import { Glider } from "../glider/glider";

export class Phaser extends Entity {

	constructor(
		engine: Engine,
		asset: Model,
	) {
		super();
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ asset }))

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: 1 })],
			damping: 0,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
	}

	update() {
		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
		this.mesh.orientation = quat.fromEuler(
			[0, 0, 0, 0], 0, 0, this.body.angle / Math.PI * 180)
	}
}

export class PhaserManager {

	private phaserRegistry: Set<Phaser> = new Set()

	constructor(
		private engine: Engine,
		private asset: Model,
		private role: Role<Phaser>
	) {
	}

	create(glider: Glider) {
		let phaser = new Phaser(this.engine, this.asset);
		assignRole(phaser, this.role)
		phaser.body.position = vec2.clone(glider.body.position)
		this.phaserRegistry.add(phaser)
		return phaser;
	}

	update() {
		for (let p of this.phaserRegistry) {
			p.update()
		}
	}

	remove(phaser: Phaser) {
		this.phaserRegistry.delete(phaser)
	}
}

export async function createPhaserManager(engine: Engine, role: Role<Phaser>) {

	let phaserAsset: Model
	await new Promise<void>((resolve, reject) => {
		phaserAsset = engine.graphics.sprite.load(
			"game/entities/weapons/phaser.tint.png", resolve, reject)
	})

	return new PhaserManager(
		engine,
		phaserAsset,
		role
	)
}