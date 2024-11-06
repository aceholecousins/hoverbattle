import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { quat, vec2, vec3 } from "gl-matrix";
import { Glider, GLIDER_RADIUS } from "../glider/glider";
import { Powerup } from "game/entities/powerups/powerup";
import { Visual } from "game/graphics/visual";
import { Entity } from "game/entities/entity";
import { Projectile } from "game/entities/weapons/projectile";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { Attachment } from "game/physics/physics";
import { Color, colorLerp } from "utils";

let BARREL_RADIUS = 0.6
let DRONE_RADIUS = 0.6
let DRONE_DAMPING = 0.5

export class NashwanPowerup implements Powerup {
	public readonly kind = "nashwan"
}

type NashwanShotFactory = (position: vec2, angle: number) => NashwanShot;

export class Barrel extends Entity {
	private attachment: Attachment
	private tNextShot = 0

	constructor(
		public parent: Glider,
		public attachTo: Entity,
		public offset: vec2,
		model: Model,
		private laserFactory: NashwanShotFactory,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: model })
		)
		this.mesh.scaling = vec3.fromValues(BARREL_RADIUS, BARREL_RADIUS, BARREL_RADIUS)
		this.mesh.baseColor = parent.player.color

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: BARREL_RADIUS })],
			mass: 0.01,
			damping: 0,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)

		let rotatedOffset = vec2.rotate(vec2.create(), offset, [0, 0], this.attachTo.body.angle)
		this.body.position = vec2.add(vec2.create(), this.attachTo.body.position, rotatedOffset)
		this.attachment = engine.physics.attach(this.attachTo.body, this.body, true, 30)
		this.parent.onDispose(() => this.dispose())
		this.update(0)
	}

	update(dt: number) {
		this.tNextShot -= dt
		if (this.tNextShot <= 0) {
			this.tNextShot += 0.5
			let position = vec2.copy(vec2.create(), this.body.position)
			position[0] += Math.cos(this.body.angle) * BARREL_RADIUS * 3
			position[1] += Math.sin(this.body.angle) * BARREL_RADIUS * 3
			this.laserFactory(position, this.body.angle)
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

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: DRONE_RADIUS })],
			mass: 0.1,
			damping: DRONE_DAMPING,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.parent.onDispose(() => this.dispose())

		let rotatedOffset = vec2.rotate(vec2.create(), this.offset, [0, 0], this.attachTo.body.angle)
		let target = vec2.add(vec2.create(), this.attachTo.body.position, rotatedOffset)

		this.body.position = target

		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.tNextShot -= dt
		if (this.tNextShot <= 0) {
			this.tNextShot += 0.5
			for (let phi = 0.0001; phi < 2 * Math.PI; phi += 2 * Math.PI / 12) {
				let position = vec2.copy(vec2.create(), this.body.position)
				position[0] += Math.cos(this.body.angle + phi) * DRONE_RADIUS * 2
				position[1] += Math.sin(this.body.angle + phi) * DRONE_RADIUS * 2
				this.particleFactory(position, this.body.angle + phi)
			}
		}

		let rotatedOffset = vec2.rotate(vec2.create(), this.offset, [0, 0], this.attachTo.body.angle)
		let target = vec2.add(vec2.create(), this.attachTo.body.position, rotatedOffset)

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

export class NashwanShot extends Entity implements Projectile {
	public collidesWithParent = false
	public collidesWithSibling = false

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
				scaling: vec3.fromValues(spriteScale[0], spriteScale[1], 1)
			}))
		this.mesh.baseColor = parent.player.color
		this.mesh.accentColor1 = { r: 1, g: 1, b: 1 }

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
	let barrelModel = (await engine.graphics.loadModel(
		"assets/models/barrel.glb")).model
	let droneModel = (await engine.graphics.loadModel(
		"assets/models/drone.glb")).model
	let nashwanLaser = await engine.graphics.loadSprite(
		"assets/sprites/nashwan_laser.tint.png")
	let nashwanParticle = await engine.graphics.loadSprite(
		"assets/sprites/particle.tint.png")

	return function (parent: Glider, shotModifier: (shot: NashwanShot) => void) {

		let particleFactory = function (position: vec2, angle: number) {
			let particle = new NashwanShot(
				parent, position, angle, [0.3, 0.3], 0.3, 10, nashwanParticle, engine
			)
			shotModifier(particle)
			return particle
		}
		let laserFactory = function (position: vec2, angle: number) {
			let laser = new NashwanShot(
				parent, position, angle, [4.0, 1.0], 0.3, 30, nashwanLaser, engine
			)
			shotModifier(laser)
			return laser
		}

		let leftBarrel1 = new Barrel(parent, parent,
			vec2.fromValues(-0.1, GLIDER_RADIUS + BARREL_RADIUS),
			barrelModel, laserFactory, engine)
		let leftBarrel2 = new Barrel(parent, leftBarrel1,
			vec2.fromValues(-0.2, BARREL_RADIUS * 2),
			barrelModel, laserFactory, engine)
		let rightBarrel1 = new Barrel(parent, parent,
			vec2.fromValues(-0.1, -GLIDER_RADIUS - BARREL_RADIUS),
			barrelModel, laserFactory, engine)
		let rightBarrel2 = new Barrel(parent, rightBarrel1,
			vec2.fromValues(-0.2, -BARREL_RADIUS * 2),
			barrelModel, laserFactory, engine)
		let drone = new Drone(parent, parent,
			vec2.fromValues(-GLIDER_RADIUS - 1.5 * DRONE_RADIUS, 0),
			droneModel, particleFactory, engine)
		return { leftBarrel1, leftBarrel2, rightBarrel1, rightBarrel2, drone }
	}
}
