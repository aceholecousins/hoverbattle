import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { Vector2, Vector3, ypr, vec2FromDir } from "math"
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle";
import { Powerup } from "game/entities/powerups/powerup";
import { Visual } from "game/graphics/visual";
import { Entity } from "game/entities/entity";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { Attachment } from "game/physics/physics";
import { Color, colorLerp } from "utils/color";
import { broker, } from "broker"
import { createMissileFactory } from "./missile"

let BARREL_RADIUS = 0.5
let DRONE_RADIUS = 0.6
let DRONE_DAMPING = 0.5

export class NashwanPowerup implements Powerup {
	public readonly kind = "nashwan"
}

type NashwanShotFactory = (position: Vector2, angle: number) => NashwanShot;

export class Barrel extends Entity {
	private deployed = 0
	private attachment: Attachment
	private tNextShot = 0

	constructor(
		public parent: Vehicle,
		public attachTo: Entity,
		public offset: Vector2,
		model: Model,
		private laserFactory: NashwanShotFactory,
		private rechargeTime: number,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: model })
		)
		this.mesh.setScale(BARREL_RADIUS)
		this.mesh.setBaseColor(parent.player.color)
		this.mesh.setAccentColor1(colorLerp(parent.player.color, { r: 0, g: 0, b: 0 }, 0.5))
		this.mesh.setAccentColor2({ r: 0, g: 0, b: 0 })
		this.mesh.setPositionZ(0.1)

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: BARREL_RADIUS })],
			mass: 0.01,
			damping: 0,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)

		this.body.copyPosition(this.parent.body)
		this.body.copyAngle(this.attachTo.body)
		this.attachment = engine.physics.attach(this.attachTo.body, this.body)
		this.attachment.setOffset(new Vector2(0, 0), 0)
		this.parent.onDispose(() => this.dispose())

		this.collidesWithParent = false
		this.collidesWithSibling = false

		this.update(0)
	}

	update(dt: number) {
		this.deployed += 2 * dt
		this.deployed = Math.min(1, this.deployed)
		this.attachment.setOffset(
			this.offset.clone().multiplyScalar(this.deployed), 0)

		if (this.deployed == 1) {
			this.collidesWithParent = true
			this.collidesWithSibling = true
			this.tNextShot -= dt
			if (this.tNextShot <= 0) {
				this.tNextShot += this.rechargeTime
				let position = this.body.getPosition().clone()
					.addScaledVector(vec2FromDir(this.body.getAngle()), BARREL_RADIUS * 3)
				this.laserFactory(position, this.body.getAngle())
			}
		}
		this.mesh.copy2dPose(this.body)
	}

	dispose() {
		this.attachment.detach()
		super.dispose()
	}
}

export class Drone extends Entity {
	private time = 0
	private tNextShot = 0
	private deployed = 0

	constructor(
		public parent: Vehicle,
		public attachTo: Entity,
		public offset: Vector2,
		model: Model,
		private particleFactory: NashwanShotFactory,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: model })
		)
		this.mesh.setScale(DRONE_RADIUS)
		this.mesh.setBaseColor(parent.player.color)
		this.mesh.setAccentColor1({ r: 1, g: 0.5, b: 0 })
		this.mesh.setAccentColor2(colorLerp(parent.player.color, { r: 0, g: 0, b: 0 }, 0.5))
		this.mesh.setPositionZ(0.1)

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: DRONE_RADIUS })],
			mass: 0.1,
			damping: DRONE_DAMPING,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.parent.onDispose(() => this.dispose())

		this.body.copyPosition(this.parent.body)

		this.collidesWithParent = false
		this.collidesWithSibling = false

		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.tNextShot -= dt
		this.deployed += 2 * dt
		this.deployed = Math.min(1, this.deployed)

		if (this.deployed == 1) {
			this.collidesWithParent = true
			this.collidesWithSibling = true

			if (this.tNextShot <= 0) {
				this.tNextShot += 0.5
				for (let phi = 0.0001; phi < 2 * Math.PI; phi += 2 * Math.PI / 12) {
					let position = this.body.getPosition().clone()
						.addScaledVector(vec2FromDir(this.body.getAngle() + phi), DRONE_RADIUS * 2)
					this.particleFactory(position, this.body.getAngle() + phi)
				}
			}

		}

		let rotatedOffset = this.offset.clone().rotateAround({ x: 0, y: 0 }, this.attachTo.body.getAngle())
		let target = this.attachTo.body.getPosition().clone().addScaledVector(rotatedOffset, this.deployed)

		let force = target.sub(this.body.getPosition())
		force.multiplyScalar(5 * force.length())
		this.body.applyForce(force)

		this.mesh.setPositionXY(this.body.getPosition())
		this.mesh.setAngle(this.time * 6.28)
	}

	dispose() {
		super.dispose()
	}
}

export class XenonQuadBlaster {
	private time = 0
	private tNextShot = 0
	private updateHandler = (e: any) => this.update(e.dt)

	constructor(
		public parent: Vehicle,
		private shotFactory: NashwanShotFactory
	) {
		broker.update.addHandler(this.updateHandler)
		this.parent.onDispose(() => this.dispose())
	}

	update(dt: number) {
		this.time += dt
		this.tNextShot -= dt
		if (this.tNextShot <= 0) {
			this.tNextShot += 0.3
			let offset1 = new Vector2(
				this.parent.body.getPosition().x + Math.sin(this.parent.body.getAngle()) * 0.5,
				this.parent.body.getPosition().y - Math.cos(this.parent.body.getAngle()) * 0.5
			)
			let offset2 = new Vector2(
				this.parent.body.getPosition().x - Math.sin(this.parent.body.getAngle()) * 0.5,
				this.parent.body.getPosition().y + Math.cos(this.parent.body.getAngle()) * 0.5
			)
			this.shotFactory(offset1, this.parent.body.getAngle())
			this.shotFactory(offset2, this.parent.body.getAngle())
			this.shotFactory(this.parent.body.getPosition(), this.parent.body.getAngle() + Math.PI / 2)
			this.shotFactory(this.parent.body.getPosition(), this.parent.body.getAngle() - Math.PI / 2)
		}
	}

	dispose() {
		broker.update.removeHandler(this.updateHandler)
	}
}

export class NashwanShot extends Entity {

	constructor(
		public parent: Vehicle,
		position: Vector2,
		angle: number,
		spriteScale: Vector2,
		radius: number,
		speed: number,
		model: Model,
		engine: Engine
	) {
		super();
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({
				model,
				scale: new Vector3(spriteScale.x, spriteScale.y, spriteScale.y)
			}))
		this.mesh.setBaseColor({ r: 1, g: 1, b: 1 })
		this.mesh.setAccentColor1(parent.player.color)
		this.mesh.setPositionZ(0.1)

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius })],
			damping: 0,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.body.setPosition(position)
		this.body.setAngle(angle)
		this.body.setVelocity(new Vector2(
			Math.cos(this.body.getAngle()) * speed,
			Math.sin(this.body.getAngle()) * speed
		))

		this.collidesWithParent = false
		this.collidesWithSibling = false

		this.update(0)
	}

	update(dt: number) {
		this.mesh.copy2dPose(this.body)
	}
}

export async function createNashwanFactory(engine: Engine) {
	let xenonShot = await engine.graphics.loadSprite(
		"assets/sprites/xenon_shot.tint.png")
	let barrelModel = (await engine.graphics.loadModel(
		"assets/models/barrel.glb")).model
	let droneModel = (await engine.graphics.loadModel(
		"assets/models/drone.glb")).model
	let nashwanLaser = await engine.graphics.loadSprite(
		"assets/sprites/nashwan_laser.tint.png")
	let nashwanParticle = await engine.graphics.loadSprite(
		"assets/sprites/particle.tint.png")

	let createMissile = await createMissileFactory(engine)

	return function (parent: Vehicle, shotModifier: (shot: NashwanShot) => void) {

		let shotFactory = function (position: Vector2, angle: number) {
			let shot = new NashwanShot(
				parent, position, angle, new Vector2(1, 1), 0.3, 20, xenonShot, engine
			)
			shotModifier(shot)
			return shot
		}
		let laserFactory = function (position: Vector2, angle: number) {
			let laser = new NashwanShot(
				parent, position, angle, new Vector2(4, 1), 0.3, 35, nashwanLaser, engine
			)
			shotModifier(laser)
			return laser
		}
		let missileFactory = function (position: Vector2, angle: number) {
			let missile = createMissile(
				parent, position, angle, []
			)
			shotModifier(missile)
			return missile
		}
		let particleFactory = function (position: Vector2, angle: number) {
			let particle = new NashwanShot(
				parent, position, angle, new Vector2(0.5, 0.5), 0.3, 10, nashwanParticle, engine
			)
			shotModifier(particle)
			return particle
		}

		let leftBarrel1 = new Barrel(parent, parent,
			new Vector2(-0.1, VEHICLE_RADIUS + BARREL_RADIUS),
			barrelModel, missileFactory, 0.4, engine)
		let leftBarrel2 = new Barrel(parent, leftBarrel1,
			new Vector2(-0.2, BARREL_RADIUS * 2),
			barrelModel, laserFactory, 0.5, engine)
		let rightBarrel1 = new Barrel(parent, parent,
			new Vector2(-0.1, -VEHICLE_RADIUS - BARREL_RADIUS),
			barrelModel, missileFactory, 0.4, engine)
		let rightBarrel2 = new Barrel(parent, rightBarrel1,
			new Vector2(-0.2, -BARREL_RADIUS * 2),
			barrelModel, laserFactory, 0.5, engine)
		let drone = new Drone(parent, parent,
			new Vector2(-VEHICLE_RADIUS - 1.5 * DRONE_RADIUS, 0),
			droneModel, particleFactory, engine)
		let quadBlaster = new XenonQuadBlaster(parent, shotFactory)
		return { leftBarrel1, leftBarrel2, rightBarrel1, rightBarrel2, drone, quadBlaster }
	}
}
