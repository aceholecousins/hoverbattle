import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { Vector2, Vector3, ypr, vec2FromDir, appendZ } from "math"
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle";
import { Powerup } from "game/entities/powerups/powerup";
import { Visual } from "game/graphics/visual";
import { Entity } from "game/entities/entity";
import { Circle } from "game/physics/shapes";
import { Attachment } from "game/physics/physics";
import { Actor } from "game/entities/actor";

let MINIGUN_LENGTH = 1.6
let MINIGUN_DIAMETER = 0.2 * MINIGUN_LENGTH
let SPINUP_TIME = 1.0
let FIRE_RATE = 4000 / 60
let AMMO = FIRE_RATE * 5 // 5 seconds worth of ammo

export class MinigunPowerup implements Powerup {
	public readonly kind = "minigun"
	public ammo = AMMO
	public guns:Minigun[] = []
}

export class Minigun extends Entity {
	private attachment: Attachment
	private time = 0
	private tNextShot = 0
	private holdingTrigger = false

	constructor(
		public parent: Vehicle,
		public offset: Vector2,
		public onHit: (actor: Actor) => void,
		gunModel: Model,
		private shotModel: Model,
		private sparkModel: Model,
		public engine: Engine
	) {

		let createBody = (self: Entity) => {
			let body = engine.physics.addRigidBody({
				actor: self,
				shapes: [new Circle(0.1)],
				mass: 0.01,
				damping: 0,
				angularDamping: 0
			})

			body.copyPosition(parent.body)
			body.copyAngle(parent.body)
			return body
		}

		let createMesh = (self: Entity) => {
			let mesh = engine.graphics.mesh.createFromModel({ model: gunModel })
			mesh.setScale(MINIGUN_LENGTH / 2)
			mesh.setBaseColor(parent.player.color)
			mesh.setPositionZ(0.5)
			return mesh
		}

		super(createBody, createMesh);

		this.attachment = engine.physics.attach({
			bodyA: this.parent.body,
			bodyB: this.body,
			canCollide: true,
			offsetB: this.offset
		})
		this.parent.onDispose(() => this.dispose())

		this.collidesWithParent = false
		this.collidesWithSibling = false

		this.update(0)
	}

	setTrigger(fire: boolean) {
		this.holdingTrigger = fire
	}

	update(dt: number) {
		this.time += dt
		this.tNextShot -= dt
		while (this.holdingTrigger && this.tNextShot <= 0) {
			this.tNextShot += 1 / FIRE_RATE
			new MinigunShot(
				this.body.getPosition(),
				this.body.getAngle(),
				1000,
				this.onHit,
				this.shotModel,
				this.sparkModel,
				this.engine
			)
		}

		this.mesh.copy2dPose(this.body)
		this.mesh.setAnimationProgress(this.time * Math.sign(this.offset.y))
	}

	dispose() {
		this.attachment.detach()
		super.dispose()
	}
}

export class Spark extends Visual {
	time: number = 0

	constructor(
		position: Vector3,
		model: Model,
		engine: Engine
	) {
		let mesh = engine.graphics.mesh.createFromModel({ model })
		mesh.setPosition(position)
		mesh.setScale(new Vector3(0.1, 0.1, 1))
		super(mesh)
	}

	update(dt: number) {
		this.time += dt;
		if (this.time > 1.0) {
			this.dispose()
		}
	}
}

export class MinigunShot extends Visual {
	frames: number = 0

	constructor(
		start: Vector2,
		angle: number,
		maxDistance: number,
		onHit: (actor: Actor) => void,
		shotModel: Model,
		sparkModel: Model,
		private engine: Engine
	) {
		super(engine.graphics.mesh.createFromModel({ model: shotModel }))
		let z = 0.5 + Math.random() * 0.1
		this.mesh.setPositionZ(z)

		let p1 = start
		let p2 = vec2FromDir(angle).multiplyScalar(maxDistance).add(p1)
		let hit = this.engine.physics.rayCast(p1, p2)
		if (hit !== null) {
			p2 = hit.position
			new Spark(appendZ(p2, z + 0.1), sparkModel, engine)
			onHit(hit.actor)
		}

		let distance = p1.distanceTo(p2)
		this.mesh.setPositionXY(p1.lerp(p2, 0.5))
		this.mesh.setScale(new Vector3(distance, 0.1, 1))
		this.mesh.setAngle(angle)
	}

	update(dt: number) {
		this.frames++
		if (this.frames == 2) {
			this.dispose()
		}
	}

	dispose() {
		super.dispose()
	}
}

export async function createMinigunFactory(engine: Engine) {

	let gunModel = (await engine.graphics.loadModel(
		"assets/models/minigun.glb")).model
	let shotModel = await engine.graphics.loadSprite(
		"assets/sprites/minigun_shot.tint.png")
	let sparkModel = await engine.graphics.loadSprite(
		"assets/sprites/sparks.png")

	return function (parent: Vehicle, onHit: (actor: Actor) => void) {

		let leftGun = new Minigun(parent,
			new Vector2(0.3, -VEHICLE_RADIUS*0.7 - MINIGUN_DIAMETER / 2),
			onHit,
			gunModel, shotModel, sparkModel,
			engine)
		let rightGun = new Minigun(parent,
			new Vector2(0.3, VEHICLE_RADIUS*0.7 + MINIGUN_DIAMETER / 2),
			onHit,
			gunModel, shotModel, sparkModel,
			engine)
		return [leftGun, rightGun]
	}
}
