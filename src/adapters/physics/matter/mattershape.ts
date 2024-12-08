import { Shape, ShapeConfig } from "game/physics/shape"
import * as p2 from "p2"
import { Vector2 } from "math"
import { Kind, Registry } from "utils/general"

export abstract class P2Shape<K extends Kind> implements Shape<K> {
	kind: K

	abstract p2shape: p2.Shape

	// sadly we cannot have this constructor since we must call using super()
	// before accessing this.p2shape and we must assign this.p2shape before
	// setting the offset, hence we need to call the two setters in each subclass
	// constructor(config: ShapeConfig<K>) {
	// 	this.setOffsetPosition(config.offsetPosition)
	// 	this.setOffsetAngle(config.offsetAngle)
	// }

	updateP2() {
		this.p2shape.updateBoundingRadius()
		if (this.p2shape.body !== null) { // when called before the shape was added to the body
			this.p2shape.body.aabbNeedsUpdate = true
			this.p2shape.body.updateBoundingRadius()
		}
	}

	setOffsetPosition(position: Vector2) {
		this.p2shape.position[0] = position.x
		this.p2shape.position[1] = position.y
	}
	getOffsetPosition() {
		return new Vector2(this.p2shape.position[0], this.p2shape.position[1])
	}

	setOffsetAngle(angle: number) {
		this.p2shape.angle = angle
	}
	getOffsetAngle() {
		return this.p2shape.angle
	}

	abstract setBoundingRadius(radius: number): void
	abstract getBoundingRadius(): number
}


// factory for distinct shape types
// where shape modules can register their individual constructors
type P2ShapeConstructor<K extends Kind> = new (config: ShapeConfig<K>) => P2Shape<K>

class P2ShapeFactory {

	private constructors: Registry<P2ShapeConstructor<any>> = {}

	register(kind: string, factory: P2ShapeConstructor<any>): void {
		this.constructors[kind] = factory
	}

	createShape<K extends Kind>(config: ShapeConfig<K>): P2Shape<K> {
		if (!this.constructors.hasOwnProperty(config.kind)) {
			throw new Error("P2ShapeFactory cannot create a " + config.kind)
		}
		return new this.constructors[config.kind](config)
	}
}

export const p2shapeFactory = new P2ShapeFactory()
