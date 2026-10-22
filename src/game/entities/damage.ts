import { Entity } from "./entity";
import { Role, assignRole } from "./actor";
import { onEngineReady } from "game/engine";
import { CollisionHandler } from "game/physics/collision";

export interface Damaging {
	damage: number
	impact(destructible: Destructible): void
}

let damagingRole = new Role<Damaging>("damaging")

export function makeDamaging<T extends Entity>(
	entity: T,
	damage: number,
	impactCallback: (self: T, other: Destructible) => void
) {
	let extendedEntity = entity as T & Damaging;
	extendedEntity.damage = damage
	extendedEntity.impact = (other: Destructible) => {
		impactCallback(extendedEntity, other)
	}
	assignRole(extendedEntity, damagingRole)
	return extendedEntity
}

export interface Destructible {
	hit(damage: number): void
	repair(restore: number): void
}

export let destructibleRole = new Role<Destructible>("destructible")

export function makeDestructible<T extends Entity>(
	entity: T,
	initialHitpoints: number,
	destroyCallback: (entity: T) => void
) {
	let extendedEntity = entity as T & Destructible;
	let hitpoints = initialHitpoints
	extendedEntity.hit = (damage: number) => {
		hitpoints -= damage
		if (hitpoints <= 0) {
			destroyCallback(extendedEntity)
			hitpoints = initialHitpoints
		}
	}
	extendedEntity.repair = (restore: number) => {
		hitpoints = Math.min(hitpoints + restore, initialHitpoints)
	}
	assignRole(extendedEntity, destructibleRole)
	return extendedEntity
}

onEngineReady(engine => {
	engine.physics.registerCollisionHandler(new CollisionHandler(
		damagingRole, destructibleRole, (damaging: Damaging, destructible: Destructible) => {
			damaging.impact(destructible)
			destructible.hit(damaging.damage)
		}
	))
})