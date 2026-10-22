import { broker } from "broker";
import { getEngine } from "game/engine";
import { Circle } from "game/physics/shapes";
import { Vector2, Vector3 } from "math"
import { collideWithEverythingRole, Entity } from "game/entities/entity";
import { Vehicle } from "game/entities/vehicles/vehicle";
import { Resource } from "game/resourcemanager";
import { assignRole } from "../actor";
import { makeDamaging, makeDestructible } from "../damage";

const PHASER_LENGTH = 0.8;
const PHASER_SPEED = 30;
const PHASER_FIRE_RATE = 12;

export class PhaserShot extends Entity {
	public collidesWithParent = false
	public collidesWithSibling = false

	private static model = new Resource(() =>
		getEngine().graphics.loadSprite("assets/sprites/phaser.tint.png")
	)

	constructor(
		public parent: Vehicle,
		position: Vector2
	) {
		let createBody = (self: Entity) => {
			let body = getEngine().physics.addRigidBody({
				actor: self,
				shapes: [new Circle(0.3)],
				damping: 0,
				angularDamping: 0
			})
			body.setPosition(position)
			return body
		}
		let createMesh = (self: Entity) => {
			let mesh = getEngine().graphics.mesh.createFromModel({
				model: PhaserShot.model.get(),
				scale: new Vector3(PHASER_LENGTH, PHASER_LENGTH / 2, 1)
			})
			mesh.setBaseColor(parent.player.team == 0 ? { r: 1, g: 0.2, b: 0 } : { r: 0, g: 0.5, b: 1 })
			mesh.setAccentColor1({ r: 1, g: 1, b: 1 })
			mesh.setPositionZ(0.1)
			return mesh
		}
		super(createBody, createMesh);

		this.update(0)
	}

	update(dt: number) {
		this.mesh.copy2dPose(this.body)
	}
}

export class PhaserWeapon {

	private coolDown: number = 1
	private updateHandler = (e: any) => this.update(e.dt)

	private static sound = new Resource(() =>
		getEngine().loadSound("assets/sounds/phaser.ogg")
	)

	constructor(
		private parent: Vehicle,
	) {
		broker.update.addHandler(this.updateHandler)
	}

	dispose() {
		broker.update.removeHandler(this.updateHandler)
	}

	tryShoot() {
		if (this.coolDown <= 0) {
			this.spawnShot(0.6)
			this.spawnShot(-0.6)
			this.pew()
		}
	}

	pew() {
		PhaserWeapon.sound.get().play(0.25, Math.random() * 0.1 + 0.5)
	}

	private spawnShot(offset: number) {
		let phi = this.parent.body.getAngle();
		let pos = this.parent.body.getPosition();
		pos = new Vector2(
			pos.x - Math.sin(phi) * offset,
			pos.y + Math.cos(phi) * offset,
		)
		let shot = new PhaserShot(this.parent, pos)
		shot.body.setAngle(phi);
		shot.body.setVelocity(new Vector2(
			Math.cos(phi) * PHASER_SPEED,
			Math.sin(phi) * PHASER_SPEED,
		))
		this.coolDown = 1 / PHASER_FIRE_RATE;

		assignRole(shot, collideWithEverythingRole)
		makeDamaging(shot, 1, () => { shot.dispose() })
		makeDestructible(shot, 1, () => { shot.dispose() })
	}

	update(dt: number) {
		this.coolDown = Math.max(0, this.coolDown - dt)
	}
}
