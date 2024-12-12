import { Vector2 } from "math"
import { Shape } from "./shapes"
import { copyIfPresent } from "utils/general"
import { Actor } from "game/entities/actor"

export interface RigidBody {
	kind: "rigidbody"

	getActor(): Actor

	setMass(mass: number): void
	getMass(): number

	setInertia(inertia: number): void
	getInertia(): number

	setPosition(position: Vector2): void
	getPosition(): Vector2
	copyPosition(source: { getPosition(): Vector2 }): void

	setVelocity(velocity: Vector2): void
	getVelocity(): Vector2

	setDamping(damping: number): void
	getDamping(): number

	setAngle(angle: number): void
	getAngle(): number
	copyAngle(source: { getAngle(): number }): void

	setAngularVelocity(velocity: number): void
	getAngularVelocity(): number

	setAngularDamping(damping: number): void
	getAngularDamping(): number

	applyForce(force: Vector2, localPointOfApplication?: Vector2): void
	applyLocalForce(force: Vector2, localPointOfApplication?: Vector2): void
	applyImpulse(impulse: Vector2, localPointOfApplication?: Vector2): void
	applyLocalImpulse(impulse: Vector2, localPointOfApplication?: Vector2): void
	applyTorque(torque: number): void
	applyAngularMomentum(angularMomentum: number): void

	destroy(): void
}

export class RigidBodyConfig {
	actor: Actor

	shapes: Shape[]

	mass = 1
	inertia = 1

	position = new Vector2(0, 0)
	velocity = new Vector2(0, 0)
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