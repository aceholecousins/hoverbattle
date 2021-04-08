import { Constructor } from "utils";
import { Entity } from "./entity";

export interface Destructible {
	hit():void
	setDestroyCallback(callback:() => void):void
}

export function makeDestructible<TBase extends Constructor<Entity>>(Base: TBase, initialHitpoints:number) {
	return class DestructibleImpl extends Base implements Destructible {
		private hitpoints: number = initialHitpoints;
		private destroy: () => void

		constructor(...rest:any[]) {
			super(...rest)
		}

		hit() {
			this.hitpoints--;
			if(this.hitpoints <= 0) {
				this.destroy()
				this.hitpoints = initialHitpoints
			}
		}

		setDestroyCallback(callback:() => void) {
			this.destroy = callback
		}
	};
}

