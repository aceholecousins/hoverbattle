
import { vec2 } from "gl-matrix"
import {ShapeConfig, Shape, shapeDefaults} from "./shape"
import {Optionals} from "../../utils"

export interface Rectangle extends Shape<"rectangle">{
	kind: "rectangle"
	sides: vec2
}

export interface RectangleConfig extends ShapeConfig<"rectangle">{
	kind: "rectangle"
	sides?: vec2
}

export const rectangleDefaults:Optionals<RectangleConfig> = {
	...shapeDefaults,
	sides: vec2.fromValues(2, 2)
}