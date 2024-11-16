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
import { appendZ } from "utils/math";

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
	private deployed = 0
	public onPrime = () => { }

	constructor(
		public parent: Glider,
		model: Model,
		engine: Engine
	) {
		super();
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({
				model,
				scale: MINE_RADIUS
			}))
		this.mesh.setBaseColor({ r: 0, g: 0, b: 0 })

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: MINE_RADIUS })],
			mass: MINE_MASS,
			damping: MINE_DAMPING,
			angularDamping: MINE_ANGULAR_DAMPING
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.body.copyPosition(this.parent.body)

		this.collidesWithParent = false

		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.deployed += dt
		this.deployed = Math.min(this.deployed, 1)

		this.mesh.setPosition(
			appendZ(this.body.getPosition(), -0.9 + this.deployed))

		if (this.deployed >= 1){
			this.collidesWithParent = true
		}
		
		this.mesh.setOrientation(quat.fromEuler(
			quat.create(),
			20 * Math.sin(this.time),
			17 * Math.sin(1.1337 * this.time),
			this.body.getAngle() / Math.PI * 180
		))

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
		let mine = this.createMine(this.parent);
		mine.body.setAngle(Math.random() * Math.PI * 2);
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
		"assets/models/seamine.glb")

	return function (parent: Glider): Mine {
		return new Mine(parent, model, engine);
	}
}
