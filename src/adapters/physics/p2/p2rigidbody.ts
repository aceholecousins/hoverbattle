import * as p2 from "p2"
import { Vector2 } from "math"
import { addShapeToBody } from "./p2shapes"
import { RigidBody, RigidBodyConfig, rigidBodyDefaults } from "game/physics/rigidbody"
import { ExtendedP2Body } from "./p2extensions"

export class P2RigidBody implements RigidBody {
	kind: "rigidbody"
	p2world: p2.World
	p2body: ExtendedP2Body
	//readonly shapes: Shape<any>[]
	toBeDeleted: boolean = false

	constructor(p2world: p2.World, config: RigidBodyConfig) {
		let cfg: Required<RigidBodyConfig> = { ...rigidBodyDefaults, ...config }

		this.p2world = p2world

		this.p2body = <ExtendedP2Body>new p2.Body() // mass set to 1 so the body is considered DYNAMIC
		this.p2body.actor = cfg.actor

		delete cfg.actor // delete temporarily // TODO

		this.setMass(cfg.mass)
		this.setPosition(cfg.position)
		this.setVelocity(cfg.velocity)
		this.setDamping(cfg.damping)
		this.setAngle(cfg.angle)
		this.setAngularVelocity(cfg.angularVelocity)
		this.setAngularDamping(cfg.angularDamping)

		cfg.actor = this.p2body.actor

		for (let shapeCfg of cfg.shapes) {
			//this.shapes.push(shape)
			addShapeToBody(shapeCfg, this.p2body)
		}

		this.p2world.addBody(this.p2body)
	}

	getActor() {
		return this.p2body.actor
	}
	isStatic(){
		return this.p2body.type === p2.Body.STATIC
	}
	hasFixedRotation(): boolean {
		return this.p2body.fixedRotation
	}

	setMass(mass: number) {
		this.p2body.mass = mass
		this.p2body.updateMassProperties()
	}
	getMass() {
		return  this.p2body.mass
	}

	setInertia(inertia: number): void {
		this.p2body.inertia = inertia
		this.p2body.updateMassProperties()
	}
	getInertia(): number {
		return this.p2body.inertia
	}

	setPosition(position: Vector2) {
		this.p2body.position[0] = position.x
		this.p2body.position[1] = position.y
	}
	getPosition(): Vector2 {
		return new Vector2(this.p2body.position[0], this.p2body.position[1])
	}
	copyPosition(source: { getPosition(): Vector2 }) {
		this.setPosition(source.getPosition())
	}

	setVelocity(velocity: Vector2) {
		this.p2body.velocity[0] = velocity.x
		this.p2body.velocity[1] = velocity.y
	}
	getVelocity(): Vector2 {
		return new Vector2(this.p2body.velocity[0], this.p2body.velocity[1])
	}

	setDamping(damping: number) {
		this.p2body.damping = damping
	}
	getDamping() {
		return this.p2body.damping
	}

	setAngle(angle: number) {
		this.p2body.angle = angle
	}
	getAngle() {
		return this.p2body.angle
	}
	copyAngle(source: { getAngle(): number }): void {
		this.p2body.angle = source.getAngle()
	}

	setAngularVelocity(velocity: number) {
		this.p2body.angularVelocity = velocity
	}
	getAngularVelocity() {
		return this.p2body.angularVelocity
	}

	setAngularDamping(damping: number) {
		this.p2body.angularDamping = damping
	}
	getAngularDamping() {
		return this.p2body.angularDamping
	}


	applyGlobalForce(
		force: Vector2,
		point: Vector2 = new Vector2(0, 0)
	) {
		this.p2body.applyForce(
			[force.x, force.y],
			[point.x, point.y]
		)
	}

	applyLocalForce(
		force: Vector2,
		point: Vector2 = new Vector2(0, 0)
	) {
		this.p2body.applyForceLocal(
			[force.x, force.y],
			[point.x, point.y]
		)
	}

	applyGlobalImpulse(
		impulse: Vector2,
		point: Vector2 = new Vector2(0, 0)
	) {
		this.p2body.applyImpulse(
			[impulse.x, impulse.y],
			[point.x, point.y]
		)
	}

	applyLocalImpulse(
		impulse: Vector2,
		point: Vector2 = new Vector2(0, 0)
	) {
		this.p2body.applyImpulseLocal(
			[impulse.x, impulse.y],
			[point.x, point.y]
		)
	}

	applyTorque(torque: number) {
		this.p2body.angularForce += torque
	}

	applyAngularImpulse(angularMomentum: number) {
		this.p2body.angularVelocity += this.p2body.invInertia * angularMomentum
	}


	destroy() {
		this.p2world.removeBody(this.p2body)
	}
}