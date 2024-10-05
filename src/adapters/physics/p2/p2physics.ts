
import { RigidBodyConfig, RigidBody } from "game/physics/rigidbody"
import { Physics } from "game/physics/physics"
import { P2RigidBody } from "./p2rigidbody"
import * as p2 from "p2"
import { ExtendedP2World, ExtendedP2Body, collisionDispatcher } from "./p2extensions"
import "./p2factorylist"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"

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

