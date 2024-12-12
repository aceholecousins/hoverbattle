import { Shape, Circle, Triangle } from "game/physics/shapes"
import * as p2 from "p2"

export function makeP2Shape(config: Shape): p2.Shape {

	if (config instanceof Circle) {
		let circle = new p2.Circle({ radius: config.radius })
		circle.position = [config.center.x, config.center.y]
		return circle
	}

	if (config instanceof Triangle) {
		let c0 = [config.corners[0].x, config.corners[0].y]
		let c1 = [config.corners[1].x, config.corners[1].y]
		let c2 = [config.corners[2].x, config.corners[2].y]

		let area = p2.Convex.triangleArea(c0, c1, c2)

		if (Math.abs(area) < 1e-100) {
			console.error("degenerate triangle")
			return new p2.Convex()
		}

		let vertices = area > 0 ? [c0, c1, c2] : [c0, c2, c1];
		return new p2.Convex({ vertices })
	}

	console.error("unknown shape type: ", config.constructor.name);
}