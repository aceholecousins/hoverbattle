
import { Actor } from "game/entities/actor"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import * as p2 from "p2"

export interface ExtendedP2World extends p2.World {
	collisionOverrides: CollisionOverride<any, any>[]
	collisionOverridesBitMask: number

	collisionHandlers: CollisionHandler<any, any>[]
}

export interface ExtendedP2Body extends p2.Body {
	actor: Actor
}

let originalCanCollide = p2.Broadphase.canCollide
p2.Broadphase.canCollide = function (bodyA: p2.Body, bodyB: p2.Body) {

	if (!originalCanCollide(bodyA, bodyB)) {
		return false
	}

	let actorA = (bodyA as ExtendedP2Body).actor
	let actorB = (bodyB as ExtendedP2Body).actor
	let rolesA = actorA.roles
	let rolesB = actorB.roles

	if ((rolesA.mask & rolesB.bits) == 0) {
		return false
	}

	// check if any override could apply
	let overridesMask = (bodyA.world as ExtendedP2World).collisionOverridesBitMask
	if (((overridesMask & rolesA.bits) == 0) || ((overridesMask & rolesB.bits) == 0)) {
		return true
	}

	// check individual overrides
	let overrides = (bodyA.world as ExtendedP2World).collisionOverrides
	for (let override of overrides) {
		if (
			(override.roleA.bit & rolesA.bits)
			&& (override.roleB.bit & rolesB.bits)
		) {
			if (override.allowCollision(actorA, actorB) === false) {
				return false
			}
		}
		if (
			(override.roleA.bit & rolesB.bits)
			&& (override.roleB.bit & rolesA.bits)
			&& rolesA.bits != rolesB.bits // otherwise we already checked that above
		) {
			if (override.allowCollision(actorB, actorA) === false) {
				return false
			}
		}
	}

	return true
}

export function collisionDispatcher(ev: any) {
	let actorA = (ev.bodyA as ExtendedP2Body).actor
	let actorB = (ev.bodyB as ExtendedP2Body).actor
	let rolesA = actorA.roles
	let rolesB = actorB.roles

	let handlers = (ev.bodyA.world as ExtendedP2World).collisionHandlers

	for (let roleA of rolesA.set) {
		for (let roleB of rolesB.set) {
			let handler = handlers[roleA.bit | roleB.bit]
			if (handler !== undefined) {
				if (handler.roleA === roleA) {
					handler.onCollision(actorA, actorB)
				}
				else {
					handler.onCollision(actorB, actorA)
				}
			}
		}
	}
}