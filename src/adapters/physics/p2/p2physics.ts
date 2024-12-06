
import { RigidBodyConfig, RigidBody } from "game/physics/rigidbody"
import { Physics, RayHit, Attachment } from "game/physics/physics"
import { P2RigidBody } from "./p2rigidbody"
import * as p2 from "p2"
import { ExtendedP2World, ExtendedP2Body, collisionDispatcher } from "./p2extensions"
import "./p2factorylist"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { Vector2, Vector3 } from "math"
import { Color } from "utils/color"

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
		bodyA: RigidBody,
		bodyB: RigidBody,
	): Attachment {
		let constraint = new p2.LockConstraint(
			(bodyA as P2RigidBody).p2body,
			(bodyB as P2RigidBody).p2body
		)
		this.p2world.addConstraint(constraint)
		return {
			setOffset: (position: Vector2, angle: number) => {
				(constraint as any).localOffsetB[0] = position.x;
				(constraint as any).localOffsetB[1] = position.y;
				(constraint as any).localAngleB = angle
			},
			setCanCollide: (canCollide: boolean) => {
				constraint.collideConnected = canCollide
			},
			setStiffness: (stiffness: number) => {
				constraint.setStiffness(stiffness)
			},
			detach: () => {
				this.p2world.removeConstraint(constraint)
			}
		}
	}

	rayCast(from: Vector2, to: Vector2, skipBackfaces: boolean): RayHit[] {
		let hits: RayHit[] = []
		var ray = new p2.Ray({
			mode: p2.Ray.ALL,
			from: [from.x, from.y],
			to: [to.x, to.y],
			skipBackfaces,
			callback: function (result) {
				var position: [number, number] = [0, 0];
				result.getHitPoint(position, ray);
				hits.push({
					actor: (result.body as ExtendedP2Body).actor,
					position: new Vector2(position[0], position[1]),
					normal: new Vector2(result.normal[0], result.normal[1])
				})
			}
		});
		var result = new p2.RaycastResult();
		this.p2world.raycast(result, ray);
		hits.sort((a, b) => {
			const distA = from.distanceToSquared(a.position);
			const distB = from.distanceToSquared(b.position);
			return distA - distB;
		});
		return hits
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

	debugDraw(drawLine: (points: Vector3[], color: Color) => void): void {
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
					}
						break;
					case (p2.Shape.CONVEX): {
						let colors = [
							{ r: 1, g: 0.2, b: 0.2 },
							{ r: 0.2, g: 1, b: 0.2 },
							{ r: 0.2, g: 0.2, b: 1 }
						]
						let convex = shape as p2.Convex
						let center = convex.centerOfMass
						for (let inner of [false, true]) {
							const points: Vector3[] = [];
							for (let i = 0; i < convex.vertices.length; i++) {
								const xy :[number, number] = [0, 0]
								if (inner) {
									xy[0] = convex.vertices[i][0] * 0.9 + center[0] * 0.1;
									xy[1] = convex.vertices[i][1] * 0.9 + center[1] * 0.1;
								}
								else {
									p2.vec2.copy(xy, convex.vertices[i]);
								}
								p2.vec2.rotate(xy, xy, convex.angle);
								p2.vec2.add(xy, xy, convex.position);
								body.toWorldFrame(xy, xy)
								points.push(new Vector3(xy[0], xy[1], 0))
							}
							if (points.length > 0) {
								points.push(points[0])
							}
							if (inner) {
								for (let i = 0; i < points.length - 1; i++) {
									drawLine([points[i], points[i + 1]], colors[i % 3]);
								}
							}
							else {
								drawLine(points, { r: 1, g: 1, b: 1 });
							}
						}
					}
						break;
				}
			}
		}
	}
}
