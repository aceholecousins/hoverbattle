import { vec2, ReadonlyVec2 } from "gl-matrix"
import { ShapeConfig, Shape } from "./shape"
import { copyIfPresent } from "utils/general"
import { Actor } from "game/entities/actor"

export interface RigidBody {
	kind: "rigidbody"

	getActor(): Actor

	//readonly shapes: Shape<any>[]

	setMass(mass: number): void
	getMass(): number

	setPosition(position: ReadonlyVec2): void
	getPosition(): ReadonlyVec2
	copyPosition(source: { getPosition(): ReadonlyVec2 }): void

	setVelocity(velocity: ReadonlyVec2): void
	getVelocity(): ReadonlyVec2

	setDamping(damping: number): void
	getDamping(): number

	setAngle(angle: number): void
	getAngle(): number
	copyAngle(source: { getAngle(): number }): void

	setAngularVelocity(velocity: number): void
	getAngularVelocity(): number

	setAngularDamping(damping: number): void
	getAngularDamping(): number

	applyForce(force: ReadonlyVec2, localPointOfApplication?: ReadonlyVec2): void
	applyLocalForce(force: ReadonlyVec2, localPointOfApplication?: ReadonlyVec2): void
	applyImpulse(impulse: ReadonlyVec2, localPointOfApplication?: ReadonlyVec2): void
	applyLocalImpulse(impulse: ReadonlyVec2, localPointOfApplication?: ReadonlyVec2): void
	applyTorque(torque: number): void
	applyAngularMomentum(angularMomentum: number): void

	destroy(): void
}

export class RigidBodyConfig {
	actor: Actor

	shapes: ShapeConfig<any>[]

	mass = 1

	position = vec2.fromValues(0, 0)
	velocity = vec2.fromValues(0, 0)
	damping = 0.1

	angle = 0
	angularVelocity = 0
	angularDamping = 0.1

	constructor(config: Pick<RigidBodyConfig, 'actor'> & Partial<RigidBodyConfig>) {
		this.actor = config.actor
		copyIfPresent(this, config, [
			"shapes", "mass", "position", "velocity", "damping",
			"angle", "angularVelocity", "angularDamping"
		])
	}
}