
import {ShapeConfig, Shape, shapeDefaults} from "./shape"
import {Optionals} from "utils"

export interface Circle extends Shape<"circle">{
	kind: "circle"
	radius: number
}

export interface CircleConfig extends ShapeConfig<"circle">{
	kind: "circle"
	radius?: number
}

export const circleDefaults:Optionals<CircleConfig> = {
	...shapeDefaults,
	radius: 1
}