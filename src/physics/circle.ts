
import {ShapeConfig, Shape, defaultShapeConfig} from "./shape"

export interface Circle extends Shape{
	kind: "circle"
	radius: number
}

export interface CircleConfig extends ShapeConfig<Circle>{
	kind: "circle"
	radius?: number
}

export let defaultCircleConfig:Required<CircleConfig> = 
	Object.assign(
		{},
		defaultShapeConfig,
		{
			kind: "circle",
			radius: 1
		},
	)


