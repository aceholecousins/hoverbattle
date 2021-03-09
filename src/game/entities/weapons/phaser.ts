import { broker } from "broker";
import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/model";
import { Engine } from "game/match";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { quat, vec2, vec3 } from "gl-matrix";
import { assignRole, Role } from "../actor";
import { Entity } from "../entity";
import { Glider } from "../glider/glider";

export class PhaserShot extends Entity {

	constructor(
		engine: Engine,
		asset: Model,
		public glider: Glider,
	) {
		super();
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({
				asset,
				scaling: vec3.fromValues(1, 0.5, 1)				
		}))
		this.mesh.baseColor = glider.team == 0 ? { r: 1, g: 0.2, b: 0 } : { r: 0, g: 0.5, b: 1 }
		this.mesh.accentColor1 = { r: 1, g: 1, b: 1 }

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: 0.3 })],
			damping: 0,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
	}

	protected update() {
		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
		this.mesh.orientation = quat.fromEuler(
			[0, 0, 0, 0], 0, 0, this.body.angle / Math.PI * 180)
	}
}

export class PhaserWeapon {

	private coolDown: number = 1
	private updateHandler = (e: any) => this.update(e.dt)

	constructor(
		private phaserManager: PhaserManager,
		private glider: Glider,
	) {
		//TODO: Remove handler on disposal of Weapon
		broker.update.addHandler(this.updateHandler)
	}

	shoot() {
		if (this.coolDown <= 0) {
			this.spawnShot(0.6);
			this.spawnShot(-0.6);
		}
	}

	private spawnShot(offset: number) {
		let shot = this.phaserManager.create(this.glider);
		let phi = this.glider.body.angle;
		let pos = this.glider.body.position;
		shot.body.position = vec2.fromValues(
			pos[0] - Math.sin(phi) * offset,
			pos[1] + Math.cos(phi) * offset,
		)
		shot.body.angle = phi;
		shot.body.velocity = vec2.fromValues(
			Math.cos(phi) * 20,
			Math.sin(phi) * 20,
		)
		this.coolDown = 0.2;
	}

	update(dt: number) {
		this.coolDown = Math.max(0, this.coolDown - dt)
	}
}

export class PhaserManager {

	constructor(
		private engine: Engine,
		private asset: Model,
		private role: Role<PhaserShot>,
	) {
	}

	create(glider: Glider) {
		let shot = new PhaserShot(this.engine, this.asset, glider);
		assignRole(shot, this.role)		
		return shot;
	}
}

export async function createPhaserManager(engine: Engine, role: Role<PhaserShot>) {

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