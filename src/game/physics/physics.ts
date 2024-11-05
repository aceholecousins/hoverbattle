
import { RigidBodyConfig, RigidBody } from "./rigidbody"
import { Actor } from "game/entities/actor"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { vec2 } from "gl-matrix"

export interface RayHit {
	actor: Actor
	position: vec2
	normal: vec2
}

export interface Attachment {
	detach(): void
}

export interface Physics {
	addRigidBody(body: RigidBodyConfig): RigidBody
	attach(bodyA: RigidBody, bodyB: RigidBody, canCollide: boolean, stiffness: number): Attachment
	registerCollisionOverride(override: CollisionOverride<any, any>): void
	registerCollisionHandler(handler: CollisionHandler<any, any>): void
	rayCast(from: vec2, to: vec2, skipBackfaces: boolean): RayHit[]
	step(dt: number): void
	getTime(): number
}
