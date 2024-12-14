import { RigidBodyConfig, RigidBody } from "game/physics/rigidbody";
import { Physics, RayHit, Attachment } from "game/physics/physics";
import { Vector2, Vector3 } from "math";
import { PlanckRigidBody } from "./planckrigidbody";
import { Color } from "utils/color";
import { CollisionOverride, CollisionHandler } from "game/physics/collision";
import * as planck from "planck";

export class PlanckPhysics implements Physics {
	planckWorld: planck.World;
	time = 0

	constructor() {
		this.planckWorld = new planck.World();
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
			setOffset: (position: Vector2, angle: number) => {},
			setCanCollide: (canCollide: boolean) => {},
			setStiffness: (stiffness: number) => {},
			detach: () => {}
		};
	}

	rayCast(from: Vector2, to: Vector2, skipBackfaces: boolean): RayHit[] {
		// const hits: RayHit[] = [];
		// const callback = (fixture, point, normal, fraction) => {
		// 	hits.push({
		// 		actor: fixture.getBody().getUserData(),
		// 		position: new Vector2(point.x, point.y),
		// 		normal: new Vector2(normal.x, normal.y)
		// 	});
		// 	return 1; // Continue for all intersections
		// };
		// this.planckWorld.rayCast(
		// 	planck.Vec2(from.x, from.y),
		// 	planck.Vec2(to.x, to.y),
		// 	callback
		// );

		// hits.sort((a, b) => {
		// 	const distA = from.distanceToSquared(a.position);
		// 	const distB = from.distanceToSquared(b.position);
		// 	return distA - distB;
		// });

		return [];
	}

	registerCollisionOverride(override: CollisionOverride<any, any>) {
		// Handle collision overrides manually as Planck.js doesn't have a built-in feature
	}

	registerCollisionHandler(handler: CollisionHandler<any, any>) {
		// Add collision handling via world contact listeners
		// this.planckWorld.on('begin-contact', (contact) => {
		// 	const fixtureA = contact.getFixtureA();
		// 	const fixtureB = contact.getFixtureB();
		// 	handler({ fixtureA, fixtureB, contact });
		// });
	}

	step(dt: number) {
		this.time += dt;
		this.planckWorld.step(dt);
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
