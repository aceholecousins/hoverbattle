
import { RigidBodyConfig, RigidBody } from "game/physics/rigidbody"
import { Physics, RayHit, Attachment, AttachmentConfig } from "game/physics/physics"
import { P2RigidBody } from "./p2rigidbody"
import * as p2 from "p2"
import { ExtendedP2World, ExtendedP2Body, collisionDispatcher } from "./p2collisionhandling"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { Vector2, Vector3 } from "math"
import { Color } from "utils/color"
import { DrawDebugLine, DrawDebugText } from "game/graphics/graphics"

// https://github.com/schteppe/p2.js/blob/master/build/p2.js
// code investigation entry point: World.prototype.internalStep

export class P2Physics implements Physics {

	p2world: ExtendedP2World

	constructor() {
		this.p2world = <ExtendedP2World>new p2.World({ gravity: [0, 0] })
		this.p2world.collisionOverrides = []
		this.p2world.collisionOverridesBitMask = 0
		this.p2world.on('impact', collisionDispatcher)
		this.p2world.collisionHandlers = []
	}

	addRigidBody(config: RigidBodyConfig): RigidBody {
		const body = new P2RigidBody(this.p2world, config)
		return body
	}

	attach(
		config: AttachmentConfig
	): Attachment {
		let constraint = new p2.LockConstraint(
			(config.bodyA as P2RigidBody).p2body,
			(config.bodyB as P2RigidBody).p2body,
			{
				localOffsetB: config.offsetB ? [config.offsetB.x, config.offsetB.y] : undefined,
				localAngleB: config.angleB
			}
		)
		constraint.collideConnected = config.canCollide
		
		this.p2world.addConstraint(constraint)
		return {
			detach: () => {
				this.p2world.removeConstraint(constraint)
			}
		}
	}

	// rayCast(from: Vector2, to: Vector2): RayHit[] { // reports all hits
	// 	let hits: RayHit[] = []
	// 	var ray = new p2.Ray({
	// 		mode: p2.Ray.ALL,
	// 		from: [from.x, from.y],
	// 		to: [to.x, to.y],
	// 		skipBackfaces: true,
	// 		callback: function (result) {
	// 			var position: [number, number] = [0, 0];
	// 			result.getHitPoint(position, ray);
	// 			hits.push({
	// 				actor: (result.body as ExtendedP2Body).actor,
	// 				position: new Vector2(position[0], position[1]),
	// 				normal: new Vector2(result.normal[0], result.normal[1])
	// 			})
	// 		}
	// 	});
	// 	var result = new p2.RaycastResult();
	// 	this.p2world.raycast(result, ray);
	// 	hits.sort((a, b) => {
	// 		const distA = from.distanceToSquared(a.position);
	// 		const distB = from.distanceToSquared(b.position);
	// 		return distA - distB;
	// 	});
	// 	return hits
	// }

	rayCast(from: Vector2, to: Vector2): RayHit | null { // reports closest hit
		var ray = new p2.Ray({
			mode: p2.Ray.CLOSEST,
			from: [from.x, from.y],
			to: [to.x, to.y],
			skipBackfaces: true
		});

		var result = new p2.RaycastResult()
		let hit = this.p2world.raycast(result, ray)
		if (!hit) {
			return null
		}
		let position = p2.vec2.create()
		result.getHitPoint(position, ray)

		return {
			actor: (result.body as ExtendedP2Body).actor,
			position: new Vector2(position[0], position[1]),
			normal: new Vector2(result.normal[0], result.normal[1])
		}
	}

	registerCollisionOverride(override: CollisionOverride<any, any>) {
		this.p2world.collisionOverrides.push(override)
		this.p2world.collisionOverridesBitMask |= override.roleA.bit | override.roleB.bit
	}

	registerCollisionHandler(handler: CollisionHandler<any, any>) {
		this.p2world.collisionHandlers[handler.mask] = handler
	}

	step(dt: number) {
		this.p2world.step(dt)
	}

	getTime(): number {
		return this.p2world.time
	}

	debugDraw(drawLine: DrawDebugLine, drawText: DrawDebugText): void {
		const p2world = this.p2world
		for (let body of p2world.bodies) {
			for (let shape of body.shapes) {
				switch (shape.type) {
					case (p2.Shape.CIRCLE): {
						let circle = shape as p2.Circle
						let xy: [number, number] = [0, 0]
						body.toWorldFrame(xy, circle.position)
						const numSegments = 16;
						const angleStep = (2 * Math.PI) / numSegments;
						const points: Vector3[] = [];
						for (let i = 0; i <= numSegments; i++) {
							const angle = i * angleStep;
							points.push(new Vector3(
								xy[0] + circle.radius * Math.cos(angle),
								xy[1] + circle.radius * Math.sin(angle),
								0
							));
						}
						drawLine(points, { r: 1, g: 1, b: 1 });
						drawText(
							body.id + ":" + shape.id,
							new Vector3(xy[0], xy[1], 0),
							{ r: 1, g: 1, b: 1 }
						);
					}
						break;
					case (p2.Shape.CONVEX): {
						let convex = shape as p2.Convex
						const points: Vector3[] = [];
						for (let i = 0; i < convex.vertices.length; i++) {
							const xy: [number, number] = [0, 0]
							p2.vec2.copy(xy, convex.vertices[i]);
							p2.vec2.rotate(xy, xy, convex.angle);
							p2.vec2.add(xy, xy, convex.position);
							body.toWorldFrame(xy, xy)
							points.push(new Vector3(xy[0], xy[1], 0))
						}
						if (points.length > 0) {
							points.push(points[0])
						}
						drawLine(points, { r: 1, g: 1, b: 1 });
						let center = new Vector3(
							(points[0].x + points[1].x + points[2].x) / 3,
							(points[0].y + points[1].y + points[2].y) / 3,
							0
						)
						drawText(
							body.id + ":" + shape.id,
							center,
							{ r: 1, g: 1, b: 1 }
						);
					}
						break;
				}
			}
		}
	}
}
