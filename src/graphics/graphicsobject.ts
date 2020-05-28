
import {vec3, quat} from "gl-matrix"
import {Optionals, Color} from "../utils"

export interface Model{}

export interface GraphicsObject{
	kind:string
	model:Model
	color:Color
	position:vec3
	orientation:quat
	scaling:vec3
	remove():void
}

export interface GraphicsObjectConfig{
	kind?:string
	model?:Model
	color?:Color
	position?:vec3
	orientation?:quat
	scaling?:vec3
}

export const graphicsObjectDefaults:Optionals<GraphicsObjectConfig> = {
	kind:"graphicsobject",
	model:null,
	color:{r:1, g:1, b:1},
	position:vec3.fromValues(0, 0, 0),
	orientation:quat.fromValues(0, 0, 0, 1),
	scaling:vec3.fromValues(1, 1, 1)
}