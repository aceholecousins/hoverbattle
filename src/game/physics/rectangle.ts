
import { Vector2 } from "math"
import { ShapeConfig, Shape } from "./shape"
import { copyIfPresent } from "utils/general"

export interface Rectangle extends Shape<"rectangle"> {
	kind: "rectangle"
	sides: Vector2
}

export class RectangleConfig extends ShapeConfig<"rectangle"> {
	kind: "rectangle" = "rectangle"
	sides = new Vector2(2, 2)

	constructor(config: Partial<RectangleConfig>) {
		super(config)
		copyIfPresent(this, config, ["sides"])
	}
}