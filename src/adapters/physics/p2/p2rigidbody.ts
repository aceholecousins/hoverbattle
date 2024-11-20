import * as p2 from "p2"
import { vec2, ReadonlyVec2 } from "gl-matrix"
import { p2shapeFactory } from "./p2shape"
import { RigidBody, RigidBodyConfig } from "game/physics/rigidbody"
import { ExtendedP2Body } from "./p2extensions"

export class P2RigidBody implements RigidBody {
	kind: "rigidbody"
	p2world: p2.World
	p2body: ExtendedP2Body
	//readonly shapes: Shape<any>[]
	toBeDeleted: boolean = false

	constructor(p2world: p2.World, config: RigidBodyConfig) {
		this.p2world = p2world

		this.p2body = <ExtendedP2Body>new p2.Body() // mass set to 1 so the body is considered DYNAMIC
		this.p2body.actor = config.actor

		delete config.actor // delete temporarily // TODO

		this.setMass(config.mass)
		this.setPosition(config.position)
		this.setVelocity(config.velocity)
		this.setDamping(config.damping)
		this.setAngle(config.angle)
		this.setAngularVelocity(config.angularVelocity)
		this.setAngularDamping(config.angularDamping)

		config.actor = this.p2body.actor

		for (let shapeCfg of config.shapes) {
			let shape = p2shapeFactory.createShape<any>(shapeCfg)
			//this.shapes.push(shape)
			this.p2body.addShape(shape.p2shape)
		}

		this.p2world.addBody(this.p2body)
	}

	getActor() {
		return this.p2body.actor
	}

	setMass(mass: number) {
		if (mass === Infinity) {
			this.p2body.type = p2.Body.STATIC
		}
		else {
			this.p2body.type = p2.Body.DYNAMIC
			this.p2body.mass = mass
		}
		this.p2body.updateMassProperties()
	}
	getMass() {
		return this.p2body.type === p2.Body.STATIC ? Infinity : this.p2body.mass
	}

	setPosition(position: ReadonlyVec2) {
		vec2.copy(this.p2body.position, position)
	}
	getPosition(): ReadonlyVec2 {
		return this.p2body.position
	}
	copyPosition(source: { getPosition(): ReadonlyVec2 }) {
		vec2.copy(this.p2body.position, source.getPosition())
	}

	setVelocity(velocity: ReadonlyVec2) {
		vec2.copy(this.p2body.velocity, velocity)
	}
	getVelocity(): ReadonlyVec2 {
		return this.p2body.velocity
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


	applyForce(
		force: ReadonlyVec2,
		localPointOfApplication: ReadonlyVec2 = vec2.fromValues(0, 0)
	) {
		this.p2body.applyForce(
			[force[0], force[1]],
			[localPointOfApplication[0], localPointOfApplication[1]]
		)
	}

	applyLocalForce(
		force: ReadonlyVec2,
		localPointOfApplication: ReadonlyVec2 = vec2.fromValues(0, 0)
	) {
		this.p2body.applyForceLocal(
			[force[0], force[1]],
			[localPointOfApplication[0], localPointOfApplication[1]]
		)
	}

	applyImpulse(
		impulse: ReadonlyVec2,
		localPointOfApplication: ReadonlyVec2 = vec2.fromValues(0, 0)
	) {
		this.p2body.applyImpulse(
			[impulse[0], impulse[1]],
			[localPointOfApplication[0], localPointOfApplication[1]]
		)
	}

	applyLocalImpulse(
		impulse: ReadonlyVec2,
		localPointOfApplication: ReadonlyVec2 = vec2.fromValues(0, 0)
	) {
		this.p2body.applyImpulseLocal(
			[impulse[0], impulse[1]],
			[localPointOfApplication[0], localPointOfApplication[1]]
		)
	}

	applyTorque(torque: number) {
		this.p2body.angularForce += torque
	}

	applyAngularMomentum(angularMomentum: number) {
		this.p2body.angularVelocity += this.p2body.invInertia * angularMomentum
	}


	destroy() {
		this.p2world.removeBody(this.p2body)
	}
}