
import { ShapeConfig, Shape } from "./shape"
import { copyIfPresent } from "utils/general"

export interface Circle extends Shape<"circle"> {
	kind: "circle"
	setRadius(radius: number): void
	getRadius(): number
}

export class CircleConfig extends ShapeConfig<"circle"> {
	kind: "circle" = "circle"
	radius = 1

	constructor(config: Partial<CircleConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["radius"])
	}
}