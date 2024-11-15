
import { ShapeConfig, Shape } from "./shape"
import { copyIfPresent } from "utils/general"
import { vec2 } from "gl-matrix"
import { Triangle2 } from "utils/math"

export interface Triangle extends Shape<"triangle"> {
	kind: "triangle"
	corners: Triangle2
}

export class TriangleConfig extends ShapeConfig<"triangle"> {
	kind: "triangle" = "triangle"
	corners = [
		vec2.fromValues(1, 0),
		vec2.fromValues(-1, 1),
		vec2.fromValues(-1, -1)
	]

	constructor(config: Partial<TriangleConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["corners"])
	}
}