
import * as p2 from "p2"
import { P2Shape, p2shapeFactory } from "./p2shape"
import { Triangle, TriangleConfig } from "game/physics/triangle"
import { Triangle2, Vector2 } from "math"

export class P2Triangle extends P2Shape<"triangle"> implements Triangle {
	kind: "triangle"
	p2shape: p2.Convex

	constructor(config: TriangleConfig) {
		super()

		let area = p2.Convex.triangleArea(
			[config.corners[0].x, config.corners[0].y],
			[config.corners[1].x, config.corners[1].y],
			[config.corners[2].x, config.corners[2].y]
		)

		if (Math.abs(area) < 1e-100) {
			this.p2shape = new p2.Convex()
			console.error("degenerate triangle")
		}
		else if (area > 0) {
			this.p2shape = new p2.Convex({
				vertices: [
					[config.corners[0].x, config.corners[0].y],
					[config.corners[1].x, config.corners[1].y],
					[config.corners[2].x, config.corners[2].y]
				]
			})
		}
		else {
			this.p2shape = new p2.Convex({
				vertices: [
					[config.corners[0].x, config.corners[0].y],
					[config.corners[2].x, config.corners[2].y],
					[config.corners[1].x, config.corners[1].y]
				]
			})
		}

		this.setCorners(config.corners)
		this.setOffsetPosition(config.offsetPosition)
		this.setOffsetAngle(config.offsetAngle)
	}

	setCorners(corners: Triangle2) {
		this.p2shape.vertices = [
			[corners[0].x, corners[0].y],
			[corners[1].x, corners[1].y],
			[corners[2].x, corners[2].y]
		]
		this.updateP2()
	}
	getCorners(): Triangle2 {
		return [
			new Vector2(this.p2shape.vertices[0][0], this.p2shape.vertices[0][1]),
			new Vector2(this.p2shape.vertices[1][0], this.p2shape.vertices[1][1]),
			new Vector2(this.p2shape.vertices[2][0], this.p2shape.vertices[2][1])
		]
	}

	setBoundingRadius(r: number) {
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
	getBoundingRadius() {
		return this.p2shape.boundingRadius
	}
}

p2shapeFactory.register("triangle", P2Triangle)


