
import {vec2} from "gl-matrix"

// parameters that are common to all shapes

export interface ShapeConfigBase{
	kind: string
	offset?: vec2
	offsetAngle?: number
}
export interface ShapeBase extends Required<ShapeConfigBase>{
	boundingRadius: number
}

// circle shape

export interface CircleConfig extends ShapeConfigBase{
	kind: "circle"
	radius: number
}
export interface Circle extends Omit<ShapeBase, "kind">, Required<CircleConfig>{}

// square shape

export interface RectangleConfig extends ShapeConfigBase{
	kind: "rectangle"
	sides: vec2
}
export interface Rectangle extends Omit<ShapeBase, "kind">, Required<RectangleConfig>{}

// discriminated unions

export type ShapeConfig = CircleConfig | RectangleConfig
export type Shape = Circle | Rectangle