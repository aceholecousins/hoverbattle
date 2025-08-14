import { RigidBodyConfig, RigidBody } from "game/physics/rigidbody";
import { Physics, RayHit, Attachment, AttachmentConfig } from "game/physics/physics";
import { Vector2, Vector3 } from "math";
import { PlanckRigidBody } from "./planckrigidbody";
import { Color } from "utils/color";
import { CollisionOverride, CollisionHandler } from "game/physics/collision";
import * as planck from "planck";
import './planckcollisionfilter'
import { Actor } from "game/entities/actor";
import { ExtendedPlanckWorld } from "./planckcollisionfilter";
import { DrawDebugLine, DrawDebugText } from "game/graphics/graphics";

class BufferedCollision {
	handler: CollisionHandler<any, any>
	actorA: Actor
	actorB: Actor
}

export class PlanckPhysics implements Physics {
	planckWorld: ExtendedPlanckWorld;
	collisionHandlers: CollisionHandler<any, any>[] = []
	collisionBuffer: BufferedCollision[] = []
	time = 0

	constructor() {
		this.planckWorld = new planck.World() as ExtendedPlanckWorld;
		this.planckWorld.collisionOverrides = []
		this.planckWorld.collisionOverridesBitMask = 0

		let bufferCollision = (
			contact: planck.Contact,
			impulse: planck.ContactImpulse
		) => {
			let actorA = contact.getFixtureA().getBody().getUserData() as Actor
			let actorB = contact.getFixtureB().getBody().getUserData() as Actor
			let rolesA = actorA.roles
			let rolesB = actorB.roles

			let handlers = this.collisionHandlers

			for (let roleA of rolesA.set) {
				for (let roleB of rolesB.set) {
					let handler = handlers[roleA.bit | roleB.bit]
					if (handler !== undefined) {
						if (handler.roleA === roleA) {
							this.collisionBuffer.push({ handler, actorA, actorB })
						}
						else {
							this.collisionBuffer.push({ handler, actorA: actorB, actorB: actorA })
						}
					}
				}
			}
		}
		this.planckWorld.on('post-solve', bufferCollision);
	}

	addRigidBody(config: RigidBodyConfig): RigidBody {
		let body = new PlanckRigidBody(this.planckWorld, config);
		return body
	}

	attach(config: AttachmentConfig): Attachment {

		let bodyA = (config.bodyA as PlanckRigidBody).body
		let bodyB = (config.bodyB as PlanckRigidBody).body

		let offsetB: planck.Vec2
		if (config.offsetB !== undefined) {
			offsetB = new planck.Vec2(config.offsetB.x, config.offsetB.y);
		} else {
			offsetB = bodyA.getLocalPoint(bodyB.getPosition())
		}
		let referenceAngle = config.angleB ?? bodyB.getAngle() - bodyA.getAngle();

		let localAnchorA = offsetB.clone().mul(0.5)

		const dx = localAnchorA.x - offsetB.x
		const dy = localAnchorA.y - offsetB.y
		const c = Math.cos(referenceAngle)
		const s = Math.sin(referenceAngle)

		let localAnchorB = new planck.Vec2(c * dx + s * dy, -s * dx + c * dy)

		const joint = new planck.WeldJoint({
			bodyA,
			bodyB,
			localAnchorA,
			localAnchorB,
			referenceAngle,
			collideConnected: config.canCollide
		});
		this.planckWorld.createJoint(joint);

		return {
			detach: () => {
				this.planckWorld.destroyJoint(joint);
			}
		};
	}

	rayCast(from: Vector2, to: Vector2): RayHit | null {
		let hit: RayHit | null = null;
		const callback = (fixture: planck.Fixture, point: planck.Vec2, normal: planck.Vec2, fraction: number) => {
			hit = {
				actor: fixture.getBody().getUserData() as Actor,
				position: new Vector2(point.x, point.y),
				normal: new Vector2(normal.x, normal.y)
			};
			return fraction
		};
		this.planckWorld.rayCast(from, to, callback);

		return null;
	}

	registerCollisionOverride(override: CollisionOverride<any, any>) {
		this.planckWorld.collisionOverrides.push(override)
		this.planckWorld.collisionOverridesBitMask |= override.roleA.bit | override.roleB.bit
	}

	registerCollisionHandler(handler: CollisionHandler<any, any>) {
		this.collisionHandlers[handler.mask] = handler
	}

	step(dt: number) {
		this.time += dt;
		this.planckWorld.step(dt);
		for (let collision of this.collisionBuffer) {
			collision.handler.onCollision(collision.actorA, collision.actorB);
		}
		this.collisionBuffer = []
	}

	getTime(): number {
		return this.time
	}

	debugDraw(drawLine: DrawDebugLine, drawText: DrawDebugText): void {
		for (let body = this.planckWorld.getBodyList(); body; body = body.getNext()) {
			for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
				const shape = fixture.getShape();
				if (shape.getType() === "circle") {
					const circle = shape as planck.Circle;
					const center = body.getWorldPoint(circle.m_p);
					const radius = circle.m_radius;
					const numSegments = 16;
					const angleStep = (2 * Math.PI) / numSegments;
					const points: Vector3[] = [];
					for (let i = 0; i <= numSegments; i++) {
						const angle = i * angleStep;
						points.push(new Vector3(
							center.x + radius * Math.cos(angle),
							center.y + radius * Math.sin(angle),
							0
						));
					}
					drawLine(points, { r: 1, g: 1, b: 1 });
					drawText((shape as any).id, new Vector3(center.x, center.y, 0), { r: 1, g: 1, b: 1 });
				}
				else if (shape.getType() === "polygon") {
					const polygon = shape as planck.Polygon;
					const vertices = polygon.m_vertices.map(v => body.getWorldPoint(v));
					const points: Vector3[] = vertices.map(v => new Vector3(v.x, v.y, 0));
					if (points.length > 0) {
						points.push(points[0])
					}
					drawLine(points, { r: 1, g: 1, b: 1 });
					const center = new Vector3(
						(points[0].x + points[1].x + points[2].x) / 3,
						(points[0].y + points[1].y + points[2].y) / 3,
						0
					)
					drawText((shape as any).id, center, { r: 1, g: 1, b: 1 });
				}
			}
		}
	}
}
