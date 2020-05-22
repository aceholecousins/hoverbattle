
import {vec3, quat} from "gl-matrix"
import {Color} from "../utils"

export interface GraphicsObjectUpdate{
	index:number
	color:Color
	position:vec3
	orientation:quat
	scale:vec3
}