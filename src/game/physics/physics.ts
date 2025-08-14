
import { DrawDebugLine, DrawDebugText } from "game/graphics/graphics"
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
	detach(): void
}

export interface AttachmentConfig {
	bodyA: RigidBody
	bodyB: RigidBody
	canCollide: boolean
	offsetB?: Vector2 // if offset is omitted, it is inferred from the current positions
	angleB?: number // same for angle
}
export interface Physics {
	addRigidBody(body: RigidBodyConfig): RigidBody
	attach(config: AttachmentConfig): Attachment
	registerCollisionOverride(override: CollisionOverride<any, any>): void
	registerCollisionHandler(handler: CollisionHandler<any, any>): void
	// rayCast(from: Vector2, to: Vector2): RayHit[] // return all hits
	rayCast(from: Vector2, to: Vector2): RayHit | null // return closest hit
	step(dt: number): void
	getTime(): number
	debugDraw(
		drawLine: DrawDebugLine,
		drawText: DrawDebugText
	): void
}
