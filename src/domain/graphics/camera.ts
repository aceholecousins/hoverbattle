
import {GraphicsObject, GraphicsObjectConfig, graphicsObjectDefaults} from "./graphicsobject"
import {Optionals} from "utils"

// the camera has a 90deg field of view, both horizontally
// and vertically and a depth range from 0.0001 to 1.0
// use scale x, y and z to modify

export interface Camera extends GraphicsObject<"camera">{
	kind:"camera"
	nearClip:number
	farClip:number
	verticalAngleOfViewInDeg:number
	activate():void
}

export interface CameraConfig extends GraphicsObjectConfig<"camera">{
	kind:"camera"
	nearClip?:number
	farClip?:number
	verticalAngleOfViewInDeg?:number
}

export const cameraDefaults:Optionals<CameraConfig> = {
	...graphicsObjectDefaults,
	nearClip:0.1,
	farClip:1000,
	verticalAngleOfViewInDeg:40
}