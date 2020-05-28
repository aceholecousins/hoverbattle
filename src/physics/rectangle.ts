
import { vec2 } from "gl-matrix"
import {ShapeConfig, Shape} from "./shape"
import {Optionals} from "../utils"

export interface Rectangle extends Shape{
	kind: "rectangle"
	sides: vec2
}

export interface RectangleConfig extends ShapeConfig<Rectangle>{
	kind: "rectangle"
	sides?: vec2
}

export const rectangleDefaults: