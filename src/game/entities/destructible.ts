import { Constructor } from "utils";
import { Entity } from "./entity";

export interface Destructible {
	hit():void	
}

export function makeDestructible<T extends Entity>(entity: T, initialHitpoints:number, destroyCallback: () => void) {
	let extendedEntity = entity as T & Destructible;	
	let hitpoints = initialHitpoints
	extendedEntity.hit = () => {
		hitpoints--
		if(hitpoints <= 0) {
			destroyCallback()
			hitpoints = initialHitpoints
		}
	}
	return extendedEntity
}

