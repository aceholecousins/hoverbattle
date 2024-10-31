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
import { Glider } from "../glider/glider";
import { Powerup } from "game/entities/powerups/powerup";
import { wrapAngle } from "utilities/math_utils";

const MISSILE_LENGTH = 1.3;
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
	public target: Entity | null;
	public roll: number = 0;

	constructor(
		public parent: Glider,
		position: vec2,
		public possibleTargets: Entity[],
		model: Model,
		engine: Engine
	) {
		super();
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({
				model,
				scaling: vec3.fromValues(MISSILE_LENGTH / 2, MISSILE_LENGTH / 2, MISSILE_LENGTH / 2)
			}))
		this.mesh.baseColor = { r: 0, g: 0, b: 0 }
		this.mesh.accentColor1 = { r: 1, g: 1, b: 1 }
		this.mesh.accentColor2 = parent.player.color

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: 0.3 * MISSILE_LENGTH })],
			mass: MISSILE_MASS,
			damping: MISSILE_DAMPING,
			angularDamping: MISSILE_ANGULAR_DAMPING
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.body.position = position

		this.target = this.lockOnTarget(parent);

		this.update(0)
	}

	private lockOnTarget(self: Entity): Entity | null {
		let bestTarget: Entity | null = null;
		let bestDot = -Infinity;

		for (const target of this.possibleTargets) {
			if (target == self) {
				continue;
			}
			const toTarget = vec2.sub(vec2.create(), target.body.position, this.body.position);
			vec2.normalize(toTarget, toTarget);
			const forward = vec2.fromValues(
				Math.cos(this.body.angle),
				Math.sin(this.body.angle)
			);
			const dot = vec2.dot(forward, toTarget);

			if (dot > bestDot) {
				bestDot = dot;
				bestTarget = target;
			}
		}

		return bestTarget;
	}

	update(dt: number) {

		if (this.target != null) {
			const toTarget = vec2.sub(vec2.create(), this.target.body.position, this.body.position);
			const toTargetAngle = Math.atan2(toTarget[1], toTarget[0]);
			let delta = wrapAngle(toTargetAngle - this.body.angle);
			this.body.applyTorque(Math.sign(delta) * MISSILE_HOMING_TORQUE);
		}

		this.body.applyLocalForce(vec2.fromValues(MISSILE_ACCELERATION * MISSILE_MASS, 0))

		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
		this.roll += dt * 300;
		this.mesh.orientation = quat.fromEuler(
			quat.create(), this.roll, 0, this.body.angle / Math.PI * 180)
	}
}

export class MissileLauncher {

	private coolDown: number = 1
	private updateHandler = (e: any) => this.update(e.dt)

	constructor(
		private createMissile: MissileFactory,
		private parent: Glider
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
		let phi = this.parent.body.angle;
		let pos = this.parent.body.position;
		let missile = this.createMissile(this.parent, pos, possibleTargets);
		missile.body.angle = phi;
		missile.body.velocity = vec2.copy([0, 0], this.parent.body.velocity)
		this.coolDown = 1 / MISSILE_FIRE_RATE
		return missile
	}

	update(dt: number) {
		this.coolDown = Math.max(0, this.coolDown - dt)
	}
}

export type MissileFactory = Awaited<ReturnType<typeof createMissileFactory>>

export async function createMissileFactory(engine: Engine) {

	let { model, meta } = await engine.graphics.loadModel(
		"game/entities/weapons/missile.glb")

	return function (parent: Glider, position:vec2, possibleTargets: Entity[]): Missile {
		return new Missile(parent, position, possibleTargets, model, engine)
	}
}
