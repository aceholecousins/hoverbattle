
import {vec2} from "gl-matrix"
import {Kind, Registry, Optionals} from "../utils"

// parameters that are common to all shapes

export interface Shape<K extends Kind> {
    kind: K
	offset: vec2
	offsetAngle: number
	boundingRadius: number
}

export interface ShapeConfig<K extends Kind>{
	kind: K
	offset?: vec2
	offsetAngle?: number
}

export const shapeDefaults:Optionals<ShapeConfig<any>> = {
	offset: vec2.fromValues(0, 0),
	offsetAngle: 0
}
