

import { Actor } from 'game/entities/actor'
import { CollisionHandler, CollisionOverride } from 'game/physics/collision'
import { Fixture, World } from 'planck';


export interface ExtendedPlanckWorld extends World {
	collisionOverrides: CollisionOverride<any, any>[]
	collisionOverridesBitMask: number
}

Fixture.prototype.shouldCollide = function (that:Fixture) {

	let bodyA = this.getBody()
	let bodyB = that.getBody()
	let actorA = bodyA.getUserData() as Actor
	let actorB = bodyB.getUserData() as Actor
	let rolesA = actorA.roles
	let rolesB = actorB.roles
	let world = bodyA.getWorld() as ExtendedPlanckWorld

	if ((rolesA.mask & rolesB.bits) == 0) {
		// symmetrical so rolesB.mask & rolesA.bits is the same
		return false
	}

	// check if any override could apply
	let overridesMask = world.collisionOverridesBitMask
	if (
		((overridesMask & rolesA.bits) == 0)
		|| ((overridesMask & rolesB.bits) == 0)
	) {
		return true
	}

	// check individual overrides
	let overrides = world.collisionOverrides
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
