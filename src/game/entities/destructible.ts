import { Constructor } from "utils";
import { Entity } from "./entity";

export interface Destructible {
	hitpoints: number
}

export function makeDestructible<TBase extends Constructor<Entity>>(Base: TBase) {
	return class DestructibleImpl extends Base implements Destructible {
		hitpoints: number;
	};
}

