
import { RigidBodyConfig, RigidBody } from "./rigidbody"
import { Actor } from "game/entities/actor"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { Vector2, Vector3 } from "math"
import { Color } from "utils/color"

export interface RayHit {
	actor: Actor
	position: Vector2
	normal: Vector2
}

export interface Attachment {
	setOffset(position: Vector2, angle: number): void
	setCanCollide(canCollide: boolean): void
	setStiffness(stiffness: number): void
	detach(): void
}

export interface Physics {
	addRigidBody(body: RigidBodyConfig): RigidBody
	attach(bodyA: RigidBody, bodyB: RigidBody): Attachment
	registerCollisionOverride(override: CollisionOverride<any, any>): void
	registerCollisionHandler(handler: CollisionHandler<any, any>): void
	// rayCast(from: Vector2, to: Vector2): RayHit[] // return all hits
	rayCast(from: Vector2, to: Vector2): RayHit | null // return closest hit
	step(dt: number): void
	getTime(): number
	debugDraw(drawLine: (points: Vector3[], color: Color) => void): void
}
