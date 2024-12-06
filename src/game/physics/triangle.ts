
import { ShapeConfig, Shape } from "./shape"
import { copyIfPresent } from "utils/general"
import { Vector2, Triangle2 } from "math"

export interface Triangle extends Shape<"triangle"> {
	kind: "triangle"
	setCorners(corners: Triangle2): void
	getCorners(): Triangle2
}

export class TriangleConfig extends ShapeConfig<"triangle"> {
	kind: "triangle" = "triangle"
	corners: Triangle2 = [
		new Vector2(1, 0),
		new Vector2(-1, 1),
		new Vector2(-1, -1)
	]

	constructor(config: Partial<TriangleConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["corners"])
	}
}