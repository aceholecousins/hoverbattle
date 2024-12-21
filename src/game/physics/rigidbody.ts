import { Vector2 } from "math"
import { Shape } from "./shapes"
import { Optionals } from "utils/general"
import { Actor } from "game/entities/actor"

// center of mass is at (0, 0), shapes need to be positioned accordingly

export interface RigidBody {
	kind: "rigidbody"

	getActor(): Actor
	isStatic(): boolean
	hasFixedRotation(): boolean

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

	applyGlobalForce(force: Vector2, point?: Vector2): void
	applyLocalForce(force: Vector2, point?: Vector2): void
	applyGlobalImpulse(impulse: Vector2, point?: Vector2): void
	applyLocalImpulse(impulse: Vector2, point?: Vector2): void
	applyTorque(torque: number): void
	applyAngularImpulse(angularMomentum: number): void

	destroy(): void
}

export interface RigidBodyConfig {
	actor: Actor

	shapes?: Shape[]

	static?: boolean
	fixedRotation?: boolean

	mass?: number
	inertia?: number

	position?: Vector2
	velocity?: Vector2
	damping?: number

	angle?: number
	angularVelocity?: number
	angularDamping?: number
}

export let rigidBodyDefaults: Required<Optionals<RigidBodyConfig>> = {
	shapes: [],
	static: false,
	fixedRotation: false,
	mass: 1,
	inertia: 1,
	position: new Vector2(0, 0),
	velocity: new Vector2(0, 0),
	damping: 0.1,
	angle: 0,
	angularVelocity: 0,
	angularDamping: 0.1
}