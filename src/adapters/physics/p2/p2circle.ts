
import * as p2 from "p2"
import { P2Shape, p2shapeFactory } from "./p2shape"
import { Circle, CircleConfig } from "game/physics/circle"

export class P2Circle extends P2Shape<"circle"> implements Circle {
	kind: "circle"
	p2shape: p2.Circle

	constructor(config: CircleConfig) {
		super()
		this.p2shape = new p2.Circle()
		this.setRadius(config.radius)
		this.setOffsetPosition(config.offsetPosition)
		this.setOffsetAngle(config.offsetAngle)
	}

	setRadius(radius: number) {
		this.p2shape.radius = radius
		this.updateP2()
	}
	getRadius(): number {
		return this.p2shape.radius
	}

	setBoundingRadius(radius: number) {
		this.p2shape.radius = radius
		this.updateP2()
	}
	getBoundingRadius() {
		return this.p2shape.boundingRadius
	}
}

p2shapeFactory.register("circle", P2Circle)


