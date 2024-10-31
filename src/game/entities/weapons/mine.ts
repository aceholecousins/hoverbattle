import { broker } from "broker";
import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { Sound } from "game/sound";
import { quat, vec2, vec3 } from "gl-matrix";
import { assignRole, Role } from "../actor";
import { Entity } from "../entity";
import { Glider, GLIDER_RADIUS } from "../glider/glider";
import { Powerup } from "game/entities/powerups/powerup";
import { wrapAngle } from "utilities/math_utils";

const MINE_RADIUS = 1;
const MINE_MASS = 1
const MINE_DAMPING = 0.8
const MINE_ANGULAR_DAMPING = 0.3
const MINE_COOLDOWN = 1
const MINE_PRIME_DELAY = 0.3

export class MinePowerup implements Powerup {
	public readonly kind = "mine"
	public stock = 1
}

export class Mine extends Entity {
	private time = 0;
	public onPrime = () => { }

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
				scaling: vec3.fromValues(MINE_RADIUS, MINE_RADIUS, MINE_RADIUS)
			}))
		this.mesh.baseColor = { r: 0, g: 0, b: 0 }
		this.mesh.accentColor1 = { r: 1, g: 1, b: 1 }
		this.mesh.accentColor2 = parent.player.team == 0 ? { r: 1, g: 0.2, b: 0 } : { r: 0, g: 0.5, b: 1 }

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: MINE_RADIUS })],
			mass: MINE_MASS,
			damping: MINE_DAMPING,
			angularDamping: MINE_ANGULAR_DAMPING
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.body.position = position
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

		if (this.time > MINE_PRIME_DELAY) {
			this.onPrime()
		}
	}
}

export class MineThrower {

	private coolDown: number = 1
	private updateHandler = (e: any) => this.update(e.dt)

	constructor(
		private createMine: MineFactory,
		private parent: Glider
	) {
		broker.update.addHandler(this.updateHandler)
	}

	dispose() {
		broker.update.removeHandler(this.updateHandler)
	}

	tryShoot(): Mine | null {
		if (this.coolDown <= 0) {
			return this.spawnMine();
		}
		else {
			return null
		}
	}

	private spawnMine(): Mine {
		let pos = this.parent.body.position;
		const d = MINE_RADIUS + GLIDER_RADIUS
		pos[0] -= Math.cos(this.parent.body.angle) * d
		pos[1] -= Math.sin(this.parent.body.angle) * d
		let mine = this.createMine(this.parent, pos);
		mine.body.angle = Math.random() * Math.PI * 2;
		this.coolDown = MINE_COOLDOWN
		return mine
	}

	update(dt: number) {
		this.coolDown = Math.max(0, this.coolDown - dt)
	}
}

export type MineFactory = Awaited<ReturnType<typeof createMineFactory>>

export async function createMineFactory(engine: Engine) {
	let { model, meta } = await engine.graphics.loadModel(
		"game/entities/weapons/seamine.glb")

	return function (parent: Glider, position: vec2): Mine {
		return new Mine(parent, position, model, engine);
	}
}
