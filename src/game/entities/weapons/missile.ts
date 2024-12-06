import { broker } from "broker";
import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { Sound } from "game/sound";
import { assignRole, Role } from "../actor";
import { Entity } from "../entity";
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle";
import { Powerup } from "game/entities/powerups/powerup";
import { angleDelta, appendZ, Vector2, quatFromYPR, vec2FromDir, DEG } from "math";
import { SmokeFactory, createSmokeFactory } from "game/graphics/explosion/smoke"
import { memoize } from "utils/general";

const MISSILE_LENGTH = 1.3;
const MISSILE_RADIUS = 0.3 * MISSILE_LENGTH;
const MISSILE_MASS = 1;
const MISSILE_ACCELERATION = 70;
const MISSILE_DAMPING = 0.8;
const MISSILE_ANGULAR_DAMPING = 0.999;
const MISSILE_HOMING_TORQUE = 1.2;
const MISSILE_FIRE_RATE = 1;

export class MissilePowerup implements Powerup {
	public readonly kind = "missile"
	public stock = 3
}

export class Missile extends Entity {
	public isMissile = true
	public target: Entity | null;
	public roll: number = 0;
	private tNextSmoke = 0

	constructor(
		public parent: Vehicle,
		position: Vector2,
		angle: number,
		public possibleTargets: Entity[],
		private createSmoke: SmokeFactory,
		model: Model,
		engine: Engine
	) {
		super();
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({
				model,
				scale: MISSILE_LENGTH / 2
			}))
		this.mesh.setBaseColor({ r: 0, g: 0, b: 0 })
		this.mesh.setAccentColor1({ r: 1, g: 1, b: 1 })
		this.mesh.setAccentColor2(parent.player.color)

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: MISSILE_RADIUS })],
			mass: MISSILE_MASS,
			damping: MISSILE_DAMPING,
			angularDamping: MISSILE_ANGULAR_DAMPING
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.body.setPosition(position)
		this.body.setAngle(angle)

		this.target = this.lockOnTarget(parent);

		this.collidesWithParent = false

		this.update(0)
	}

	private lockOnTarget(self: Entity): Entity | null {
		let bestTarget: Entity | null = null;
		let bestDot = -Infinity;

		for (const target of this.possibleTargets) {
			if (target == self) {
				continue;
			}
			const toTarget = target.body.getPosition().clone().sub(this.body.getPosition()).normalize();

			const forward = vec2FromDir(this.body.getAngle())
			const dot = forward.dot(toTarget);

			if (dot > bestDot) {
				bestDot = dot;
				bestTarget = target;
			}
		}

		return bestTarget;
	}

	update(dt: number) {
		if (
			this.body.getPosition().distanceTo(this.parent.body.getPosition())
			> (MISSILE_RADIUS + VEHICLE_RADIUS) * 1.5
		) {
			this.collidesWithParent = true
		}

		this.tNextSmoke -= dt
		if (this.tNextSmoke <= 0) {
			this.tNextSmoke += 0.04
			this.createSmoke(
				appendZ(this.body.getPosition(), 0.1),
				{ r: 0.2, g: 0.2, b: 0.2 }
			)
		}

		if (this.target != null) {
			const toTargetAngle = this.target.body.getPosition().clone()
				.sub(this.body.getPosition()).angle();
			let delta = angleDelta(this.body.getAngle(), toTargetAngle);
			this.body.applyTorque(Math.sign(delta) * MISSILE_HOMING_TORQUE);
		}

		this.body.applyLocalForce(new Vector2(MISSILE_ACCELERATION * MISSILE_MASS, 0))

		this.mesh.setPosition(appendZ(this.body.getPosition(), 0.1))
		this.roll += dt * 300 * DEG;
		this.mesh.setOrientation(quatFromYPR(
			this.body.getAngle(), 0, this.roll))
	}
}

export class MissileLauncher {

	private coolDown: number = 1
	private updateHandler = (e: any) => this.update(e.dt)

	constructor(
		private createMissile: MissileFactory,
		private parent: Vehicle
	) {
		broker.update.addHandler(this.updateHandler)
	}

	dispose() {
		broker.update.removeHandler(this.updateHandler)
	}

	tryShoot(possibleTargets: Entity[]): Missile | null {
		if (this.coolDown <= 0) {
			return this.spawnMissile(possibleTargets);
		}
		else {
			return null
		}
	}

	private spawnMissile(possibleTargets: Entity[]): Missile {
		let phi = this.parent.body.getAngle();
		let pos = this.parent.body.getPosition();
		let missile = this.createMissile(this.parent, pos, phi, possibleTargets);
		missile.body.setVelocity(this.parent.body.getVelocity())
		this.coolDown = 1 / MISSILE_FIRE_RATE
		return missile
	}

	update(dt: number) {
		this.coolDown = Math.max(0, this.coolDown - dt)
	}
}

export type MissileFactory = Awaited<ReturnType<typeof createMissileFactory>>

export let createMissileFactory = memoize(async function (engine: Engine) {

	let { model, meta } = await engine.graphics.loadModel(
		"assets/models/missile.glb")
	let createSmoke = await createSmokeFactory(engine)

	return function (
		parent: Vehicle,
		position: Vector2,
		angle: number,
		possibleTargets: Entity[]
	): Missile {
		return new Missile(
			parent,
			position,
			angle,
			possibleTargets,
			createSmoke,
			model,
			engine
		)
	}
})
