import { World, Body, BodyType, Shape, Vec2 } from "planck";
import { Vector2 } from "math";
import { toVec2 } from "./planckutils";
import { makePlanckShape } from "./planckshapes";
import { RigidBody, RigidBodyConfig } from "game/physics/rigidbody";
import { Actor } from "game/entities/actor";

export class PlanckRigidBody implements RigidBody {
	kind: "rigidbody";
	world: World;
	body: Body;
	toBeDeleted: boolean = false;

	constructor(world: World, config: RigidBodyConfig) {
		this.world = world;

		this.body = this.world.createBody({
			type: (config.mass === Infinity ? "static" : "dynamic") as BodyType,
			position: toVec2(config.position),
			angle: config.angle,
			linearVelocity: toVec2(config.velocity),
			angularVelocity: config.angularVelocity,
			linearDamping: config.damping,
			angularDamping: config.angularDamping,
			userData: config.actor
		});

		this.body.setMassData({
			mass: config.mass,
			center: new Vec2(0, 0),
			I: config.inertia
		});

		for (const shapeCfg of config.shapes) {
			const shape = makePlanckShape(shapeCfg);
			this.body.createFixture(shape, { density: 1 });
		}
	}

	getActor() {
		return this.body.getUserData() as Actor
	}

	setMass(mass: number) {
		if (mass === Infinity) {
			this.body.setType("static");
		} else {
			this.body.setType("dynamic");
			this.body.setMassData({
				mass,
				center: new Vec2(0, 0),
				I: this.body.getInertia()
			});
		}
	}
	getMass() {
		return this.body.getType() === "static" ? Infinity : this.body.getMass();
	}

	setInertia(inertia: number) {
		this.body.setMassData({
			mass: this.body.getMass(),
			center: new Vec2(0, 0),
			I: inertia
		});
	}
	getInertia() {
		return this.body.getInertia();
	}

	setPosition(position: Vector2) {
		this.body.setPosition(new Vec2(position.x, position.y));
	}
	getPosition(): Vector2 {
		const pos = this.body.getPosition();
		return new Vector2(pos.x, pos.y);
	}
	copyPosition(source: { getPosition(): Vector2 }) {
		this.setPosition(source.getPosition());
	}

	setVelocity(velocity: Vector2) {
		this.body.setLinearVelocity(new Vec2(velocity.x, velocity.y));
	}
	getVelocity(): Vector2 {
		const vel = this.body.getLinearVelocity();
		return new Vector2(vel.x, vel.y);
	}

	setDamping(damping: number) {
		this.body.setLinearDamping(damping);
	}
	getDamping() {
		return this.body.getLinearDamping();
	}

	setAngle(angle: number) {
		this.body.setAngle(angle);
	}
	getAngle() {
		return this.body.getAngle();
	}
	copyAngle(source: { getAngle(): number }): void {
		this.body.setAngle(source.getAngle());
	}

	setAngularVelocity(velocity: number) {
		this.body.setAngularVelocity(velocity);
	}
	getAngularVelocity() {
		return this.body.getAngularVelocity();
	}

	setAngularDamping(damping: number) {
		this.body.setAngularDamping(damping);
	}
	getAngularDamping() {
		return this.body.getAngularDamping();
	}

	applyForce(force: Vector2, localPoint: Vector2 = new Vector2(0, 0)) {
		this.body.applyForce(new Vec2(force.x, force.y), new Vec2(localPoint.x, localPoint.y));
	}

	applyLocalForce(force: Vector2, localPoint: Vector2 = new Vector2(0, 0)) {
		this.body.applyForceToCenter(new Vec2(force.x, force.y));
	}

	applyImpulse(impulse: Vector2, localPoint: Vector2 = new Vector2(0, 0)) {
		this.body.applyLinearImpulse(new Vec2(impulse.x, impulse.y), new Vec2(localPoint.x, localPoint.y), true);
	}

	applyLocalImpulse(impulse: Vector2, localPoint: Vector2 = new Vector2(0, 0)) {
		this.body.applyLinearImpulse(new Vec2(impulse.x, impulse.y), this.body.getWorldCenter(), true);
	}

	applyTorque(torque: number) {
		this.body.applyTorque(torque);
	}

	applyAngularMomentum(angularMomentum: number) {
		const inertia = this.body.getInertia();
		this.body.setAngularVelocity(this.body.getAngularVelocity() + angularMomentum / inertia);
	}

	destroy() {
		this.world.destroyBody(this.body);
	}
}
