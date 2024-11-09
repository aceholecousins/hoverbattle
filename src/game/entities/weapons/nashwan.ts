import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { quat, vec2, vec3 } from "gl-matrix";
import { Glider, GLIDER_RADIUS } from "../glider/glider";
import { Powerup } from "game/entities/powerups/powerup";
import { Visual } from "game/graphics/visual";
import { Entity } from "game/entities/entity";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { Attachment } from "game/physics/physics";
import { Color, colorLerp } from "utils";
import { broker, } from "broker"

let BARREL_RADIUS = 0.5
let DRONE_RADIUS = 0.6
let DRONE_DAMPING = 0.5

export class NashwanPowerup implements Powerup {
	public readonly kind = "nashwan"
}

type NashwanShotFactory = (position: vec2, angle: number) => NashwanShot;

export class Barrel extends Entity {
	private deployed = 0
	private attachment: Attachment
	private tNextShot = 0

	constructor(
		public parent: Glider,
		public attachTo: Entity,
		public offset: vec2,
		model: Model,
		private laserFactory: NashwanShotFactory,
		private rechargeTime: number,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: model })
		)
		this.mesh.scaling = vec3.fromValues(BARREL_RADIUS, BARREL_RADIUS, BARREL_RADIUS)
		this.mesh.baseColor = parent.player.color
		this.mesh.accentColor1 = colorLerp(parent.player.color, { r: 0, g: 0, b: 0 }, 0.5)
		this.mesh.accentColor2 = { r: 0, g: 0, b: 0 }

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: BARREL_RADIUS })],
			mass: 0.01,
			damping: 0,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)

		this.body.position = this.parent.body.position
		this.body.angle = this.attachTo.body.angle
		this.attachment = engine.physics.attach(this.attachTo.body, this.body)
		this.attachment.setOffset([0, 0], 0)
		this.parent.onDispose(() => this.dispose())

		this.collidesWithParent = false
		this.collidesWithSibling = false

		this.update(0)
	}

	update(dt: number) {
		this.deployed += 2 * dt
		this.deployed = Math.min(1, this.deployed)
		this.attachment.setOffset([
			this.offset[0] * this.deployed,
			this.offset[1] * this.deployed
		], 0)

		if (this.deployed == 1) {
			this.collidesWithParent = true
			this.collidesWithSibling = true
			this.tNextShot -= dt
			if (this.tNextShot <= 0) {
				this.tNextShot += this.rechargeTime
				let position = vec2.copy(vec2.create(), this.body.position)
				position[0] += Math.cos(this.body.angle) * BARREL_RADIUS * 3
				position[1] += Math.sin(this.body.angle) * BARREL_RADIUS * 3
				this.laserFactory(position, this.body.angle)
			}
		}
		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
		this.mesh.orientation = quat.fromEuler(
			quat.create(), 0, 0, this.body.angle / Math.PI * 180)
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
		public parent: Glider,
		public attachTo: Entity,
		public offset: vec2,
		model: Model,
		private particleFactory: NashwanShotFactory,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: model })
		)
		this.mesh.scaling = vec3.fromValues(DRONE_RADIUS, DRONE_RADIUS, DRONE_RADIUS)
		this.mesh.baseColor = parent.player.color
		this.mesh.accentColor1 = { r: 1, g: 0.5, b: 0 }
		this.mesh.accentColor2 = colorLerp(parent.player.color, { r: 0, g: 0, b: 0 }, 0.5)

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: DRONE_RADIUS })],
			mass: 0.1,
			damping: DRONE_DAMPING,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.parent.onDispose(() => this.dispose())

		this.body.position = this.parent.body.position

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
					let position = vec2.copy(vec2.create(), this.body.position)
					position[0] += Math.cos(this.body.angle + phi) * DRONE_RADIUS * 2
					position[1] += Math.sin(this.body.angle + phi) * DRONE_RADIUS * 2
					this.particleFactory(position, this.body.angle + phi)
				}
			}

		}

		let rotatedOffset = vec2.rotate(vec2.create(), this.offset, [0, 0], this.attachTo.body.angle)
		let target = vec2.scaleAndAdd(
			vec2.create(),
			this.attachTo.body.position,
			rotatedOffset,
			this.deployed
		)

		let force = vec2.subtract(vec2.create(), target, this.body.position)
		vec2.scale(force, force, 5 * vec2.length(force))
		this.body.applyForce(force)

		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
		this.mesh.orientation = quat.fromEuler(
			quat.create(), 0, 0, this.time * 360)
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
		public parent: Glider,
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
			let offset1 = vec2.fromValues(
				this.parent.body.position[0] + Math.sin(this.parent.body.angle) * 0.5,
				this.parent.body.position[1] - Math.cos(this.parent.body.angle) * 0.5
			)
			let offset2 = vec2.fromValues(
				this.parent.body.position[0] - Math.sin(this.parent.body.angle) * 0.5,
				this.parent.body.position[1] + Math.cos(this.parent.body.angle) * 0.5
			)
			this.shotFactory(offset1, this.parent.body.angle)
			this.shotFactory(offset2, this.parent.body.angle)
			this.shotFactory(this.parent.body.position, this.parent.body.angle + Math.PI / 2)
			this.shotFactory(this.parent.body.position, this.parent.body.angle - Math.PI / 2)
		}
	}

	dispose() {
		broker.update.removeHandler(this.updateHandler)
	}
}

export class NashwanShot extends Entity {

	constructor(
		public parent: Glider,
		position: vec2,
		angle: number,
		spriteScale: vec2,
		radius: number,
		speed: number,
		model: Model,
		engine: Engine
	) {
		super();
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({
				model,
				scaling: vec3.fromValues(spriteScale[0], spriteScale[1], spriteScale[1])
			}))
		this.mesh.baseColor = { r: 1, g: 1, b: 1 }
		this.mesh.accentColor1 = parent.player.color

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius })],
			damping: 0,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.body.position = position
		this.body.angle = angle
		this.body.velocity = vec2.fromValues(
			Math.cos(this.body.angle) * speed,
			Math.sin(this.body.angle) * speed
		)

		this.collidesWithParent = false
		this.collidesWithSibling = false

		this.update(0)
	}

	update(dt: number) {
		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
		this.mesh.orientation = quat.fromEuler(
			quat.create(), 0, 0, this.body.angle / Math.PI * 180)
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
	let nashwanMissile = (await engine.graphics.loadModel(
		"assets/models/missile.glb")).model
	let nashwanParticle = await engine.graphics.loadSprite(
		"assets/sprites/particle.tint.png")

	return function (parent: Glider, shotModifier: (shot: NashwanShot) => void) {

		let shotFactory = function (position: vec2, angle: number) {
			let shot = new NashwanShot(
				parent, position, angle, [1, 1], 0.3, 20, xenonShot, engine
			)
			shotModifier(shot)
			return shot
		}
		let laserFactory = function (position: vec2, angle: number) {
			let laser = new NashwanShot(
				parent, position, angle, [4.0, 1.0], 0.3, 35, nashwanLaser, engine
			)
			shotModifier(laser)
			return laser
		}
		let missileFactory = function (position: vec2, angle: number) {
			let missile = new NashwanShot(
				parent, position, angle, [1.0, 0.6], 0.3, 25, nashwanMissile, engine
			)
			shotModifier(missile)
			return missile
		}
		let particleFactory = function (position: vec2, angle: number) {
			let particle = new NashwanShot(
				parent, position, angle, [0.5, 0.5], 0.3, 10, nashwanParticle, engine
			)
			shotModifier(particle)
			return particle
		}

		let leftBarrel1 = new Barrel(parent, parent,
			vec2.fromValues(-0.1, GLIDER_RADIUS + BARREL_RADIUS),
			barrelModel, missileFactory, 0.4, engine)
		let leftBarrel2 = new Barrel(parent, leftBarrel1,
			vec2.fromValues(-0.2, BARREL_RADIUS * 2),
			barrelModel, laserFactory, 0.5, engine)
		let rightBarrel1 = new Barrel(parent, parent,
			vec2.fromValues(-0.1, -GLIDER_RADIUS - BARREL_RADIUS),
			barrelModel, missileFactory, 0.4, engine)
		let rightBarrel2 = new Barrel(parent, rightBarrel1,
			vec2.fromValues(-0.2, -BARREL_RADIUS * 2),
			barrelModel, laserFactory, 0.5, engine)
		let drone = new Drone(parent, parent,
			vec2.fromValues(-GLIDER_RADIUS - 1.5 * DRONE_RADIUS, 0),
			droneModel, particleFactory, engine)
		let quadBlaster = new XenonQuadBlaster(parent, shotFactory)
		return { leftBarrel1, leftBarrel2, rightBarrel1, rightBarrel2, drone, quadBlaster }
	}
}
