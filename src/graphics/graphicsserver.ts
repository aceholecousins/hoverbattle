
import {vec3, quat} from "gl-matrix"
import {Color} from "../utils"
import {GraphicsObjectUpdate} from "./commongraphics"

interface GraphicsServer{

	loadModel(index:number, file:string):void

	createObject(
		objectIndex:number,
		modelIndex:number,
		initialState:GraphicsObjectUpdate
	):void
	
	deleteObject(
		index:number
	):void

	syncObjects(updates:GraphicsObjectUpdate[]):void
}