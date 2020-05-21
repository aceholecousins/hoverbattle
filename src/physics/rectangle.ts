
import { vec2 } from "gl-matrix"
import {ShapeConfig, Shape, defaultShapeConfig} from "./shape.js"

export interface Rectangle extends Shape{
	kind: "rectangle"
	sides: vec2
}

export interface RectangleConfig extends ShapeConfig<Rectangle>{
	kind: "rectangle"
	sides?: vec2
}

export let defaultRectangleConfig:Required<RectangleConfig> = 
	Object.assign(
		{},
		defaultShapeConfig,
		{
			kind: "rectangle",
			sides: vec2.fromValues(0, 0)
		},
	)


