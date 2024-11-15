
import * as p2 from "p2"
import { P2Shape, p2shapeFactory } from "./p2shape"
import { Triangle, TriangleConfig } from "game/physics/triangle"
import { Triangle2 } from "utils/math"

export class P2Triangle extends P2Shape<"triangle"> implements Triangle {
	kind: "triangle"
	p2shape: p2.Convex

	constructor(config: TriangleConfig) {
		super()

		let area = p2.Convex.triangleArea(
			config.corners[0] as [number, number],
			config.corners[1] as [number, number],
			config.corners[2] as [number, number]
		)

		if (Math.abs(area) < 1e-100) {
			this.p2shape = new p2.Convex()
			console.error("degenerate triangle")
		}
		else if (area > 0) {
			this.p2shape = new p2.Convex({
				vertices: config.corners
			})
		}
		else {
			this.p2shape = new p2.Convex({
				vertices: [
					config.corners[0],
					config.corners[2],
					config.corners[1]
				]
			})
		}

		Object.assign(this, config)
	}

	set corners(c: Triangle2) {
		this.p2shape.vertices = c as [number, number][]
		this.updateP2()
	}
	get corners(): Triangle2 {
		return this.p2shape.vertices as Triangle2
	}

	set boundingRadius(r: number) {
		if (r <= 0) {
			console.error("triangle bounding radius must be >0")
			return
		}
		let factor = r / this.p2shape.boundingRadius
		for (let v of this.p2shape.vertices) {
			v[0] *= factor
			v[1] *= factor
		}
		this.updateP2()
	}
	get boundingRadius() {
		return this.p2shape.boundingRadius
	}
}

p2shapeFactory.register("triangle", P2Triangle)


