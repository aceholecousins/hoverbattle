
import { vec2 } from "gl-matrix"
import {ShapeConfig, Shape} from "./shape"
import {copyIfPresent} from "utils"

export interface Rectangle extends Shape<"rectangle">{
	kind: "rectangle"
	sides: vec2
}

export class RectangleConfig extends ShapeConfig<"rectangle">{
	kind: "rectangle" = "rectangle"
	sides = vec2.fromValues(2, 2)

	constructor(config:Partial<RectangleConfig>){
		super(config)
		copyIfPresent(this, config, ["sides"])
	}
}