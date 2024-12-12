import { Shape, Circle, Triangle } from "game/physics/shapes";
import * as planck from "planck";

export function makePlanckShape(config: Shape): planck.Shape {
	if (config instanceof Circle) {
		return new planck.Circle(new planck.Vec2(config.center.x, config.center.y), config.radius);
	}

	if (config instanceof Triangle) {
		let c0 = new planck.Vec2(config.corners[0].x, config.corners[0].y);
		let c1 = new planck.Vec2(config.corners[1].x, config.corners[1].y);
		let c2 = new planck.Vec2(config.corners[2].x, config.corners[2].y);

		let area = (((c1.x - c0.x) * (c2.y - c0.y)) - ((c2.x - c0.x) * (c1.y - c0.y))) * 0.5

		if (area < 1e-100) {
			console.error("degenerate triangle");
			return null;
		}

		let vertices = area > 0 ? [c0, c1, c2] : [c0, c2, c1];
		return new planck.Polygon(vertices);
	}

	console.error("unknown shape type: ", config.constructor.name);
}