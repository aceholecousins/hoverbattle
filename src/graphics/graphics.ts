
import {Model, GraphicsObject, GraphicsObjectConfig} from "./graphicsobject"

export interface Graphics{
	loadModel(file:string):Model
	addObject(config:GraphicsObjectConfig):GraphicsObject
	update():void
}