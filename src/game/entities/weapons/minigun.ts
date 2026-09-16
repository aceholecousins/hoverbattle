import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { Vector2, Vector3, ypr, vec2FromDir, appendZ, DEG } from "math"
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle";
import { Powerup } from "game/entities/powerups/powerup";
import { Visual } from "game/graphics/visual";
import { Entity } from "game/entities/entity";
import { Circle, Triangle } from "game/physics/shapes";
import { Attachment } from "game/physics/physics";
import { Actor } from "game/entities/actor";
import { randBetween } from "math"

let MINIGUN_LENGTH = 2.0
let MINIGUN_DIAMETER = 0.3 * MINIGUN_LENGTH
let SPINUP_TIME = 0.7 // about 0.5 seconds for M134
let SPINDOWN_TIME = 0.25 // about 0.25 seconds for M134
let FIRE_RATE = 6000 / 60 // 2000..6000 rounds per minute for M134
let AMMO_PER_GUN = FIRE_RATE * 5 // 5 seconds worth of ammo
let DISPERSION = 1.6 * DEG // about 0.35 deg for M134
let SHOT_SPRITE_LENGTH = 6.0
let SHOT_SPRITE_WIDTH = 0.1
let SHOT_IMPULSE = 0.45

export class MinigunPowerup implements Powerup {
	public readonly kind = "minigun"
	public guns: Minigun[] = []
}

export class Minigun extends Entity {
	ammo = AMMO_PER_GUN
	private frameAmmo = 0 // can fire this many shots during the current frame
	private holdingTrigger = false
	private attachment: Attachment
	private spin = 0 // 0 = still, 1 = full spinning speed and firing
	private roll = 0 // barrel roll angle for graphics

	constructor(
		public parent: Vehicle,
		public offset: Vector2,
		public onHit: (actor: Actor) => void,
		onDispose: () => void,
		gunModel: Model,
		private flashModel: Model,
		private shotModel: Model,
		private sparkModel: Model,
		public engine: Engine
	) {

		let w05 = MINIGUN_DIAMETER / 2
		let h05 = MINIGUN_LENGTH / 2
		let createBody = (self: Entity) => {
			let body = engine.physics.addRigidBody({
				actor: parent, // forward all interactions to the vehicle
				shapes: [
					new Triangle([new Vector2(-h05, -w05), new Vector2(h05, -w05), new Vector2(-h05, w05)]),
					new Triangle([new Vector2(h05, -w05), new Vector2(h05, w05), new Vector2(-h05, w05)])
				],
				mass: 0.01,
				inertia: 0.1,
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
		this.onDispose(onDispose)

		this.collidesWithParent = false
		this.collidesWithSibling = false

		this.update(0)
	}

	setTrigger(fire: boolean) {
		this.holdingTrigger = fire
	}

	update(dt: number) {
		if (this.holdingTrigger) {
			this.spin = Math.min(this.spin + dt / SPINUP_TIME, 1)
		}
		else {
			this.spin = Math.max(this.spin - dt / SPINDOWN_TIME, 0)
		}

		let firing = this.spin == 1
		this.roll += this.spin * FIRE_RATE / 6 * dt * randBetween(0.9, 1.1)

		if (firing || this.frameAmmo < 1) {
			this.frameAmmo += FIRE_RATE * dt
		}

		while (firing && this.ammo > 0 && this.frameAmmo >= 1) {
			this.ammo -= 1
			this.frameAmmo -= 1

			new MinigunShot(
				this.body.getPosition(),
				this.body.getAngle() + DISPERSION * Math.random(),
				1000,
				this.onHit,
				this.flashModel,
				this.shotModel,
				this.sparkModel,
				this.engine
			)

			this.parent.body.applyLocalImpulse(new Vector2(-SHOT_IMPULSE, 0))
		}

		if (this.ammo <= 0) {
			this.dispose()
		}

		this.mesh.copy2dPose(this.body)
		this.mesh.setAnimationProgress(this.roll * Math.sign(this.offset.y))
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
		angle: number,
		model: Model,
		engine: Engine
	) {
		let mesh = engine.graphics.mesh.createFromModel({ model })
		mesh.setPosition(position)
		mesh.setAngle(angle + randBetween(-30 * DEG, 30 * DEG))
		let flip = Math.random() > 0.5 ? 1 : -1
		let sx = Math.pow(randBetween(0.2, 1.0), 2) * 2.2
		let sy = Math.pow(randBetween(0.2, 1.0), 2) * 2.2
		mesh.setScale(new Vector3(sx, flip * sy, 1))
		mesh.setBaseColor({ r: 1.0, g: 1.0, b: 1.0 })
		mesh.setAccentColor1({ r: 1.0, g: 1.0, b: 0.3 })
		super(mesh)
	}

	update(dt: number) {
		this.time += dt;
		if (this.time > 0.08) {
			this.dispose()
		}
	}
}

export class MuzzleFlash extends Visual {
	time: number = 0

	constructor(
		position: Vector3,
		angle: number,
		model: Model,
		engine: Engine
	) {
		let mesh = engine.graphics.mesh.createFromModel({ model })
		let size = Math.pow(randBetween(0.6, 1.0), 2) * 2.2
		position.x += Math.cos(angle) * (size / 2 + MINIGUN_LENGTH / 2)
		position.y += Math.sin(angle) * (size / 2 + MINIGUN_LENGTH / 2)
		mesh.setPosition(position)
		mesh.setAngle(angle + randBetween(-3 * DEG, 3 * DEG))
		let flip = Math.random() > 0.5 ? 1 : -1
		mesh.setScale(new Vector3(size, flip * size / 2, 1))
		mesh.setBaseColor({ r: 1.0, g: 1.0, b: 1.0 })
		mesh.setAccentColor1({ r: 1.0, g: 1.0, b: 0.2 })
		mesh.setAccentColor2({ r: 1.0, g: 0.2, b: 0.0 })
		mesh.setOpacity(randBetween(0.2, 1.0))
		super(mesh)
	}

	update(dt: number) {
		this.time += dt;
		if (this.time > 0.02) {
			this.dispose()
		}
	}
}

export class MinigunShot extends Visual {
	time: number = 0

	constructor(
		start: Vector2,
		angle: number,
		maxDistance: number,
		onHit: (actor: Actor) => void,
		flashModel: Model,
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
			new Spark(appendZ(p2, z + 0.1), angle, sparkModel, engine)
			new MuzzleFlash(appendZ(p1, z + 0.1), angle, flashModel, engine)
			let impulse = new Vector2(
				Math.cos(angle) * SHOT_IMPULSE,
				Math.sin(angle) * SHOT_IMPULSE
			)
			let target = (hit.actor as Entity).body
			target.applyGlobalImpulse(impulse, target.getPosition())
			onHit(hit.actor)
		}

		let distance = p1.distanceTo(p2)
		if (distance > 1.5 * SHOT_SPRITE_LENGTH) {
			let q = SHOT_SPRITE_LENGTH / 2 / distance
			this.mesh.setPositionXY(p1.lerp(p2, randBetween(q, 1 - q)))
			this.mesh.setScale(new Vector3(SHOT_SPRITE_LENGTH, SHOT_SPRITE_WIDTH, 1))
		}
		else {
			this.mesh.setPositionXY(p1.lerp(p2, randBetween(1 / 3, 2 / 3)))
			this.mesh.setScale(new Vector3(distance / 1.5, SHOT_SPRITE_WIDTH, 1))
		}

		this.mesh.setAngle(angle)
		this.mesh.setBaseColor({ r: 0.2, g: 0.1, b: 0.0 })
		this.mesh.setAccentColor1({ r: 1.0, g: 1.0, b: 0.3 })
		this.mesh.setAccentColor2({ r: 1.0, g: 0.0, b: 0.0 })
	}

	update(dt: number) {
		this.time += dt
		if (this.time > 0.04) {
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
	let flashModel = await engine.graphics.loadSprite(
		"assets/sprites/muzzle_flash.tint.png")
	let shotModel = await engine.graphics.loadSprite(
		"assets/sprites/minigun_shot.tint.png")
	let sparkModel = await engine.graphics.loadSprite(
		"assets/sprites/sparks.tint.png")

	return function (parent: Vehicle, onHit: (actor: Actor) => void, onDispose: () => void) {

		let leftGun = new Minigun(parent,
			new Vector2(0.3, -VEHICLE_RADIUS * 0.7 - MINIGUN_DIAMETER / 2),
			onHit,
			onDispose,
			gunModel, flashModel, shotModel, sparkModel,
			engine)
		let rightGun = new Minigun(parent,
			new Vector2(0.3, VEHICLE_RADIUS * 0.7 + MINIGUN_DIAMETER / 2),
			onHit,
			() => { },
			gunModel, flashModel, shotModel, sparkModel,
			engine)
		return [leftGun, rightGun]
	}
}
