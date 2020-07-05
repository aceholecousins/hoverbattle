
import {Color} from "utils"
import {GraphicsObject, GraphicsObjectConfig} from "./graphicsobject"
import {Asset} from "./asset"

export interface Model extends GraphicsObject<"model">{
	baseColor: Color
	accentColor: Color
}

export class ModelConfig extends GraphicsObjectConfig<"model">{
	kind: "model" = "model"
	asset:Asset<"model">

	baseColor: Color
	accentColor: Color

	constructor(config: Partial<ModelConfig> & Pick<ModelConfig, "asset">){
		super(config)
		this.asset = config.asset
		if("baseColor" in config){this.baseColor = config.baseColor}
		if("accentColor" in config){this.accentColor = config.accentColor}
	}
}

export interface ModelFactory{
	createModel: (config:ModelConfig) => Model
}