import { Shape, Circle, Triangle } from "game/physics/shapes"
import * as p2 from "p2"

export function addShapeToBody(config: Shape, body: p2.Body) {

	if (config instanceof Circle) {
		let circle = new p2.Circle({ radius: config.radius })
		body.addShape(circle, [config.center.x, config.center.y])
	}
	else if (config instanceof Triangle) {
		let c0 = [config.corners[0].x, config.corners[0].y]
		let c1 = [config.corners[1].x, config.corners[1].y]
		let c2 = [config.corners[2].x, config.corners[2].y]

		let area = p2.Convex.triangleArea(c0, c1, c2)

		if (Math.abs(area) < 1e-100) {
			console.error("degenerate triangle")
			return
		}

		let vertices = area > 0 ? [c0, c1, c2] : [c0, c2, c1];
		body.addShape(new p2.Convex({ vertices }))
	}
	else {
		console.error("unknown shape type: ", config.constructor.name);
	}
}