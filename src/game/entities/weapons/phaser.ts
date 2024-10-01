import { broker } from "broker";
import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/model";
import { Engine } from "game/match";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { Sound } from "game/sound/soundfx";
import { quat, vec2, vec3 } from "gl-matrix";
import { assignRole, Role } from "../actor";
import { Entity } from "../entity";
import { Glider } from "../glider/glider";

const PHASER_LENGTH = 0.8;
const PHASER_SPEED = 30;
const PHASER_FIRE_RATE = 12;

let phaserSound:Sound

export class PhaserShot extends Entity {

	constructor(
		engine: Engine,
		asset: Model,
		public parent: Glider,
	) {
		super();
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({
				asset,
				scaling: vec3.fromValues(PHASER_LENGTH, PHASER_LENGTH / 2, 1)
			}))
		this.mesh.baseColor = parent.player.team == 0 ? { r: 1, g: 0.2, b: 0 } : { r: 0, g: 0.5, b: 1 }
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
		private parent: Glider,
	) {
		broker.update.addHandler(this.updateHandler)
	}

	dispose() {
		broker.update.removeHandler(this.updateHandler)
	}

	shoot() {
		if (this.coolDown <= 0) {
			this.spawnShot(0.6);
			this.spawnShot(-0.6);
			phaserSound.play(0.25, Math.random()*0.1 + 0.5)
		}
	}

	private spawnShot(offset: number) {
		let shot = this.phaserManager.create(this.parent);
		let phi = this.parent.body.angle;
		let pos = this.parent.body.position;
		shot.body.position = vec2.fromValues(
			pos[0] - Math.sin(phi) * offset,
			pos[1] + Math.cos(phi) * offset,
		)
		shot.body.angle = phi;
		shot.body.velocity = vec2.fromValues(
			Math.cos(phi) * PHASER_SPEED,
			Math.sin(phi) * PHASER_SPEED,
		)
		this.coolDown = 1 / PHASER_FIRE_RATE;
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

	create(parent: Glider) {
		let shot = new PhaserShot(this.engine, this.asset, parent);
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

	phaserSound = engine.soundFxPlayer.loadSound("game/entities/weapons/phaser.ogg")

	return new PhaserManager(
		engine,
		phaserAsset,
		role
	)
}
