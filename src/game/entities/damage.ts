import { Entity } from "./entity";


export interface Damaging {
	damage: number
	impact(): void
}

export function makeDamaging<T extends Entity>(
	entity: T,
	damage: number,
	impactCallback: (entity: T) => void
) {
	let extendedEntity = entity as T & Damaging;
	extendedEntity.damage = damage
	extendedEntity.impact = () => {
		impactCallback(extendedEntity)
	}
	return extendedEntity
}


export interface Destructible {
	hit(damage: number): void
}

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
	return extendedEntity
}

