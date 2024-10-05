import { vec2 } from "gl-matrix"
import { ShapeConfig, Shape } from "./shape"
import { copyIfPresent } from "utils"
import { Actor } from "game/entities/actor"

export interface RigidBody {
	kind: "rigidbody"

	readonly actor: Actor

	//readonly shapes: Shape<any>[]

	mass: number

	position: vec2
	velocity: vec2
	damping: number

	angle: number
	angularVelocity: number
	angularDamping: number

	applyForce(force: vec2, localPointOfApplication?: vec2): void
	applyLocalForce(force: vec2, localPointOfApplication?: vec2): void
	applyImpulse(impulse: vec2, localPointOfApplication?: vec2): void
	applyLocalImpulse(impulse: vec2, localPointOfApplication?: vec2): void
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