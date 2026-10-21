import { broker } from "broker";
import { ModelMeshConfig } from "game/graphics/mesh";
import { Model, ModelMetaData } from "game/graphics/asset";
import { getEngine } from "game/engine";
import { Circle } from "game/physics/shapes";
import { collideWithEverythingRole, Entity } from "game/entities/entity";
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle";
import { angleDelta, appendZ, Vector2, ypr, vec2FromDir, DEG } from "math";
import { Resource } from "game/resourcemanager"
import { Smoke } from "game/graphics/explosion/smoke";
import { Explosion } from "game/graphics/explosion/explosion";
import { assignRole } from "../actor";
import { makeDamaging, makeDestructible } from "../damage";

const MISSILE_LENGTH = 1.3;
const MISSILE_RADIUS = 0.3 * MISSILE_LENGTH;
const MISSILE_MASS = 1;
const MISSILE_ACCELERATION = 70;
const MISSILE_DAMPING = 1.6;
const MISSILE_ANGULAR_DAMPING = 7.0;
const MISSILE_HOMING_TORQUE = 1.2;
const MISSILE_FIRE_RATE = 1;

export class Missile extends Entity {
	public isMissile = true
	public target: Entity | null;
	public roll: number = 0;
	private tNextSmoke = 0

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/missile.glb")
	)

	constructor(
		public parent: Vehicle,
		position: Vector2,
		angle: number,
		public possibleTargets: Entity[]
	) {
		let createBody = (self: Entity) => {
			let body = getEngine().physics.addRigidBody({
				actor: self,
				shapes: [new Circle(MISSILE_RADIUS)],
				mass: MISSILE_MASS,
				damping: MISSILE_DAMPING,
				angularDamping: MISSILE_ANGULAR_DAMPING
			})
			body.setPosition(position)
			body.setAngle(angle)
			return body
		}
		let createMesh = (self: Entity) => {
			let mesh = getEngine().graphics.mesh.createFromModel({
				model: Missile.model.get().model,
				scale: MISSILE_LENGTH / 2
			})
			mesh.setBaseColor({ r: 0, g: 0, b: 0 })
			mesh.setAccentColor1({ r: 1, g: 1, b: 1 })
			mesh.setAccentColor2(parent.player.color)
			return mesh
		}
		super(createBody, createMesh);

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
			new Smoke(
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
		this.mesh.setOrientation(ypr(
			this.body.getAngle(), 0, this.roll))
	}
}

export class MissileLauncher {

	private coolDown = 0
	private updateHandler = (e: any) => this.update(e.dt)
	private stock = 3

	constructor(
		private parent: Vehicle
	) {
		broker.update.addHandler(this.updateHandler)
	}

	dispose() {
		broker.update.removeHandler(this.updateHandler)
	}

	tryShoot(possibleTargets: Entity[]) {
		if (this.coolDown <= 0) {
			let missile = this.spawnMissile(possibleTargets);

			assignRole(missile, collideWithEverythingRole)

			let explode = () => {
				missile.dispose()
				new Explosion(
					appendZ(missile.body.getPosition(), 1),
					missile.parent.player.color
				)
			}

			makeDamaging(missile, 17, () => { explode() })
			makeDestructible(missile, 3, () => { explode() })

			this.stock -= 1
			if (this.stock == 0) {
				this.parent.activePowerup?.cancel?.()
			}
		}
	}

	private spawnMissile(possibleTargets: Entity[]): Missile {
		let phi = this.parent.body.getAngle();
		let pos = this.parent.body.getPosition();
		let missile = new Missile(this.parent, pos, phi, possibleTargets);
		missile.body.setVelocity(this.parent.body.getVelocity())
		this.coolDown = 1 / MISSILE_FIRE_RATE
		return missile
	}

	update(dt: number) {
		this.coolDown = Math.max(0, this.coolDown - dt)
	}
}
