
import { RigidBodyConfig, RigidBody } from "./rigidbody"
import { Actor } from "game/entities/actor"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { vec2, vec3 } from "gl-matrix"

export interface RayHit {
	actor: Actor
	position: vec2
	normal: vec2
}

export interface Attachment {
	setOffset(position: vec2, angle: number): void
	setCanCollide(canCollide: boolean): void
	setStiffness(stiffness: number): void
	detach(): void
}

export interface Physics {
	addRigidBody(body: RigidBodyConfig): RigidBody
	attach(bodyA: RigidBody, bodyB: RigidBody): Attachment
	registerCollisionOverride(override: CollisionOverride<any, any>): void
	registerCollisionHandler(handler: CollisionHandler<any, any>): void
	rayCast(from: vec2, to: vec2, skipBackfaces: boolean): RayHit[]
	step(dt: number): void
	getTime(): number
	debugDraw(drawLine: (points: vec3[]) => void): void
}
