
import {ShapeConfig, Shape} from "./shape"

export interface Circle extends Shape<"circle">{
	kind: "circle"
	radius: number
}

export class CircleConfig extends ShapeConfig<"circle">{
	kind: "circle" = "circle"
	radius = 1
	
	constructor(config: Partial<CircleConfig>){
		super(config)
		if("radius" in config){this.radius = config.radius}
	}
}