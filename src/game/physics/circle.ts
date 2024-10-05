
import { ShapeConfig, Shape } from "./shape"
import { copyIfPresent } from "utils"

export interface Circle extends Shape<"circle"> {
	kind: "circle"
	radius: number
}

export class CircleConfig extends ShapeConfig<"circle"> {
	kind: "circle" = "circle"
	radius = 1

	constructor(config: Partial<CircleConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["radius"])
	}
}