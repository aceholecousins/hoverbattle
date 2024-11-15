import { broker } from "broker";
import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { Sound } from "game/sound";
import { quat, vec2, vec3 } from "gl-matrix";
import { quatFromAngle } from "utils/math"
import { Entity } from "../entity";
import { Glider } from "../glider/glider";

const PHASER_LENGTH = 0.8;
const PHASER_SPEED = 30;
const PHASER_FIRE_RATE = 12;

export class PhaserShot extends Entity {
	public collidesWithParent = false
	public collidesWithSibling = false

	constructor(
		public parent: Glider,
		position: vec2,
		model: Model,
		engine: Engine
	) {
		super();
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({
				model,
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
		this.body.position = position
		this.update(0)
	}

	update(dt: number) {
		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
		this.mesh.orientation = quatFromAngle(this.body.angle)
	}
}

export class PhaserWeapon {

	private coolDown: number = 1
	private updateHandler = (e: any) => this.update(e.dt)

	constructor(
		private phaserFactory: PhaserFactory,
		private parent: Glider,
	) {
		broker.update.addHandler(this.updateHandler)
	}

	dispose() {
		broker.update.removeHandler(this.updateHandler)
	}

	tryShoot(): PhaserShot[] | null {
		if (this.coolDown <= 0) {
			this.phaserFactory.playPhaserSound()
			return [this.spawnShot(0.6), this.spawnShot(-0.6)]
		}
		else {
			return null
		}
	}

	private spawnShot(offset: number) {
		let phi = this.parent.body.angle;
		let pos = this.parent.body.position;
		pos = vec2.fromValues(
			pos[0] - Math.sin(phi) * offset,
			pos[1] + Math.cos(phi) * offset,
		)
		let shot = this.phaserFactory.createShot(this.parent, pos);
		shot.body.angle = phi;
		shot.body.velocity = vec2.fromValues(
			Math.cos(phi) * PHASER_SPEED,
			Math.sin(phi) * PHASER_SPEED,
		)
		this.coolDown = 1 / PHASER_FIRE_RATE;
		return shot
	}

	update(dt: number) {
		this.coolDown = Math.max(0, this.coolDown - dt)
	}
}

export type PhaserFactory = {
	createShot: (parent: Glider, position: vec2) => PhaserShot;
	playPhaserSound: () => void;
};

export async function createPhaserFactory(engine: Engine): Promise<PhaserFactory> {

	let phaserSprite = await engine.graphics.loadSprite(
		"assets/sprites/phaser.tint.png"
	)

	const phaserSound = await engine.loadSound("assets/sounds/phaser.ogg")

	return {
		createShot: function (parent: Glider, position: vec2) {
			return new PhaserShot(parent, position, phaserSprite, engine)
		},
		playPhaserSound: function () {
			phaserSound.play(0.25, Math.random() * 0.1 + 0.5)
		}
	}
}
