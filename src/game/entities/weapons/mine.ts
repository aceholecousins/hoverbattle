import { broker } from "broker";
import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine, getEngine } from "game/engine";
import { Circle } from "game/physics/shapes";
import { collideWithEverythingRole, Entity } from "game/entities/entity";
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle";
import { Powerup } from "game/entities/powerups/powerup";
import { appendZ, Vector2, Vector3, ypr, DEG } from "math";
import { Resource } from "game/resourcemanager";
import { Explosion } from "game/graphics/explosion/explosion";
import { assignRole } from "../actor";
import { makeDamaging, makeDestructible } from "../damage";

const MINE_RADIUS = 1;
const MINE_MASS = 1
const MINE_DAMPING = 1.6
const MINE_ANGULAR_DAMPING = 0.3
const MINE_COOLDOWN = 1
const MINE_PRIME_DELAY = 0.3

export class Mine extends Entity {
	private time = 0;
	private deployed = 0
	private primed = false
	public onPrime = () => { }

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/seamine.glb")
	)

	constructor(
		public parent: Vehicle,
	) {
		let createBody = (self: Entity) => {
			let body = getEngine().physics.addRigidBody({
				actor: self,
				shapes: [new Circle(MINE_RADIUS)],
				mass: MINE_MASS,
				damping: MINE_DAMPING,
				angularDamping: MINE_ANGULAR_DAMPING
			})
			body.copyPosition(parent.body)
			return body
		}
		let createMesh = (self: Entity) => {
			let mesh = getEngine().graphics.mesh.createFromModel({
				model: Mine.model.get().model,
				scale: MINE_RADIUS
			})
			mesh.setBaseColor({ r: 0, g: 0, b: 0 })
			return mesh
		}
		super(createBody, createMesh);

		this.collidesWithParent = false

		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.deployed += dt
		this.deployed = Math.min(this.deployed, 1)

		this.mesh.setPosition(
			appendZ(this.body.getPosition(), -0.9 + this.deployed))

		if (this.deployed >= 1) {
			this.collidesWithParent = true
		}

		this.mesh.setOrientation(ypr(
			this.body.getAngle() / Math.PI * 180,
			17 * DEG * Math.sin(1.1337 * this.time),
			20 * DEG * Math.sin(this.time)
		))

		if (this.time > MINE_PRIME_DELAY && !this.primed) {
			this.primed = true
			this.onPrime()
		}
	}
}

export class MineThrower {

	private coolDown = 0
	private stock = 1
	private updateHandler = (e: any) => this.update(e.dt)

	constructor(
		private parent: Vehicle
	) {
		broker.update.addHandler(this.updateHandler)
	}

	dispose() {
		broker.update.removeHandler(this.updateHandler)
	}

	tryShoot() {
		if (this.coolDown <= 0 && this.stock > 0) {
			let mine = this.spawnMine()
			mine.onPrime = () => {
				assignRole(mine, collideWithEverythingRole)

				let explode = () => {
					mine.dispose()
					new Explosion(
						appendZ(mine.body.getPosition(), 1),
						mine.parent.player.color
					)
				}

				makeDamaging(mine, 17, explode)
				makeDestructible(mine, 3, explode)
			}
			this.stock -= 1
			if (this.stock === 0) {
				this.parent.activePowerup?.cancel?.()
			}		
		}		
	}

	private spawnMine(): Mine {
		let mine = new Mine(this.parent);
		mine.body.setAngle(Math.random() * Math.PI * 2);
		this.coolDown = MINE_COOLDOWN
		return mine
	}

	update(dt: number) {
		this.coolDown = Math.max(0, this.coolDown - dt)
	}
}
