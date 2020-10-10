
import {ShapeConfig, Shape} from "./shape"
import {copyIfPresent} from "utils"
import { vec2 } from "gl-matrix"

export type TriangleCorners = [vec2, vec2, vec2]

export interface Triangle extends Shape<"triangle">{
	kind: "triangle"
	corners: TriangleCorners
}

export class TriangleConfig extends ShapeConfig<"triangle">{
	kind: "triangle" = "triangle"
	corners = [
		vec2.fromValues(1, 0),
		vec2.fromValues(-1, 1),
		vec2.fromValues(-1, -1)	
	]

	constructor(config: Partial<TriangleConfig> = {}){
		super(config)
		copyIfPresent(this, config, ["corners"])
	}
}