import { RigidBodyConfig, RigidBody } from "game/physics/rigidbody";
import { Physics, RayHit, Attachment } from "game/physics/physics";
import { Vector2, Vector3 } from "math";
import { PlanckRigidBody } from "./planckrigidbody";
import { Color } from "utils/color";
import { CollisionOverride, CollisionHandler } from "game/physics/collision";
import * as planck from "planck";
import './planckcollisionfilter'
import { Actor } from "game/entities/actor";
import { ExtendedPlanckWorld } from "./planckcollisionfilter";

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
							this.collisionBuffer.push({handler, actorA, actorB})
						}
						else {
							this.collisionBuffer.push({handler, actorA: actorB, actorB: actorA})
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

	attach(bodyA: RigidBody, bodyB: RigidBody): Attachment {
		// const joint = planck.WeldJoint({
		// 	bodyA: bodyA.body,
		// 	bodyB: bodyB.body
		// });
		// this.planckWorld.createJoint(joint);

		// return {
		// 	setOffset: (position: Vector2, angle: number) => {
		// 		// Planck.js doesn't support offsets directly; handle manually
		// 	},
		// 	setCanCollide: (canCollide: boolean) => {
		// 		joint.collideConnected = canCollide;
		// 	},
		// 	setStiffness: (stiffness: number) => {
		// 		// Planck.js doesn't have direct stiffness control; handle manually
		// 	},
		// 	detach: () => {
		// 		this.planckWorld.destroyJoint(joint);
		// 	}
		// };
		return {
			setOffset: (position: Vector2, angle: number) => { },
			setCanCollide: (canCollide: boolean) => { },
			setStiffness: (stiffness: number) => { },
			detach: () => { }
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
		for(let collision of this.collisionBuffer) {
			collision.handler.onCollision(collision.actorA, collision.actorB);
		}
		this.collisionBuffer = []
	}

	getTime(): number {
		return this.time
	}

	debugDraw(drawLine: (points: Vector3[], color: Color) => void): void {
		// for (let body = this.planckWorld.getBodyList(); body; body = body.getNext()) {
		// 	for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
		// 		const shape = fixture.getShape();
		// 		if (shape.getType() === "circle") {
		// 			const circle = shape as planck.Circle;
		// 			const center = body.getWorldPoint(circle.m_p);
		// 			const radius = circle.m_radius;
		// 			const numSegments = 16;
		// 			const angleStep = (2 * Math.PI) / numSegments;
		// 			const points: Vector3[] = [];
		// 			for (let i = 0; i <= numSegments; i++) {
		// 				const angle = i * angleStep;
		// 				points.push(new Vector3(
		// 					center.x + radius * Math.cos(angle),
		// 					center.y + radius * Math.sin(angle),
		// 					0
		// 				));
		// 			}
		// 			drawLine(points, { r: 1, g: 1, b: 1 });
		// 		}
		// 	}
		// }
	}
}
