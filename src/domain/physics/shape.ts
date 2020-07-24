
import {vec2} from "gl-matrix"
import {Kind, copyIfPresent} from "utils"

// parameters that are common to all shapes

export interface Shape<K extends Kind> {
    kind: K
	offset: vec2
	offsetAngle: number
	boundingRadius: number
}

export class ShapeConfig<K extends Kind>{
	kind: K
	offset = vec2.fromValues(0, 0)
	offsetAngle = 0

	constructor(config:Partial<ShapeConfig<K>>){
		this.kind = config.kind
		copyIfPresent(this, config, ["offset", "offsetAngle"])
	}
}