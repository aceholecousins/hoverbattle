import { World, Body, BodyType, Shape, Vec2 } from "planck";
import { Vector2 } from "math";
import { toVec2 } from "./planckutils";
import { makePlanckShape } from "./planckshapes";
import { RigidBody, RigidBodyConfig, rigidBodyDefaults } from "game/physics/rigidbody";
import { Actor } from "game/entities/actor";

export class PlanckRigidBody implements RigidBody {
	kind: "rigidbody";
	world: World;
	body: Body;
	toBeDeleted: boolean = false;

	constructor(world: World, config: RigidBodyConfig) {
		let cfg: Required<RigidBodyConfig> = { ...rigidBodyDefaults, ...config };

		this.world = world;

		this.body = this.world.createBody({
			type: (cfg.static ? "static" : "dynamic") as BodyType,
			fixedRotation: cfg.fixedRotation,
			position: toVec2(cfg.position),
			angle: cfg.angle,
			linearVelocity: toVec2(cfg.velocity),
			angularVelocity: cfg.angularVelocity,
			linearDamping: cfg.damping,
			angularDamping: cfg.angularDamping,
			userData: cfg.actor
		});

		for (const shapeCfg of cfg.shapes) {
			const shape = makePlanckShape(shapeCfg);
			this.body.createFixture(shape, { density: 1 });
		}

		this.body.setMassData({
			mass: cfg.mass,
			center: new Vec2(0, 0),
			I: cfg.inertia
		});

	}

	getActor() {
		return this.body.getUserData() as Actor
	}
	isStatic() {
		return this.body.getType() === "static";
	}
	hasFixedRotation() {
		return this.body.isFixedRotation();
	}

	setMass(mass: number) {
		this.body.setMassData({
			mass,
			center: new Vec2(0, 0),
			I: this.body.getInertia()
		});
	}
	getMass() {
		return this.body.getMass()
	}

	setInertia(inertia: number) {
		this.body.setMassData({
			mass: this.body.getMass(),
			center: new Vec2(0, 0),
			I: inertia
		})
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

	applyGlobalForce(force: Vector2, point: Vector2 = new Vector2(0, 0)) {
		this.body.applyForce(new Vec2(force.x, force.y), new Vec2(point.x, point.y), true);
	}

	applyLocalForce(force: Vector2, point: Vector2 = new Vector2(0, 0)) {
		let globalPoint = this.body.getWorldPoint(new Vec2(point.x, point.y));
		let globalForce = this.body.getWorldVector(new Vec2(force.x, force.y));
		this.body.applyForce(globalForce, globalPoint, true)
	}

	applyGlobalImpulse(impulse: Vector2, point: Vector2 = new Vector2(0, 0)) {
		this.body.applyLinearImpulse(new Vec2(impulse.x, impulse.y), new Vec2(point.x, point.y), true);
	}

	applyLocalImpulse(impulse: Vector2, point: Vector2 = new Vector2(0, 0)) {
		let globalPoint = this.body.getWorldPoint(new Vec2(point.x, point.y));
		let globalImplulse = this.body.getWorldVector(new Vec2(impulse.x, impulse.y));
		this.body.applyLinearImpulse(globalImplulse, globalPoint, true);
	}

	applyTorque(torque: number) {
		this.body.applyTorque(torque, true);
	}

	applyAngularImpulse(angularMomentum: number) {
		this.body.applyAngularImpulse(angularMomentum, true);
	}

	destroy() {
		this.world.destroyBody(this.body);
	}
}
