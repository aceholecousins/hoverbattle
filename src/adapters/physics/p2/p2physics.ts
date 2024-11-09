
import { RigidBodyConfig, RigidBody } from "game/physics/rigidbody"
import { Physics, RayHit, Attachment } from "game/physics/physics"
import { P2RigidBody } from "./p2rigidbody"
import * as p2 from "p2"
import { ExtendedP2World, ExtendedP2Body, collisionDispatcher } from "./p2extensions"
import "./p2factorylist"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { vec2 } from "gl-matrix"

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
			setOffset: (position: vec2, angle: number) => {
				vec2.copy((constraint as any).localOffsetB, position);
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

	rayCast(from: vec2, to: vec2, skipBackfaces: boolean): RayHit[] {
		let hits: RayHit[] = []
		var ray = new p2.Ray({
			mode: p2.Ray.ALL,
			from: from as [number, number],
			to: to as [number, number],
			skipBackfaces,
			callback: function (result) {
				var position = vec2.create();
				result.getHitPoint(position as [number, number], ray);
				hits.push({
					actor: (result.body as ExtendedP2Body).actor,
					position,
					normal: vec2.clone(result.normal)
				})
			}
		});
		var result = new p2.RaycastResult();
		this.p2world.raycast(result, ray);
		hits.sort((a, b) => {
			const distA = vec2.squaredDistance(from, a.position);
			const distB = vec2.squaredDistance(from, b.position);
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

}

