
import {GraphicsObject, GraphicsObjectConfig} from "./graphicsobject"

export interface Camera extends GraphicsObject<"camera">{
	kind:"camera"
	nearClip:number
	farClip:number
	verticalAngleOfViewInDeg:number
	activate():void
}

export class CameraConfig extends GraphicsObjectConfig<"camera">{
	kind:"camera" = "camera"
	nearClip = 0.1
	farClip = 1000
	verticalAngleOfViewInDeg = 40

	constructor(config:Partial<CameraConfig> = {}){
		super(config)
		if("nearClip" in config){this.nearClip = config.nearClip}
		if("farClip" in config){this.farClip = config.farClip}
		if("verticalAngleOfViewInDeg" in config){
			this.verticalAngleOfViewInDeg = config.verticalAngleOfViewInDeg
		}
	}	
}

export interface CameraFactory{
	create: (config: CameraConfig) => Camera
}