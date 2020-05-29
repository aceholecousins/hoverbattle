
import {Color, Optionals} from "../utils"
import {GraphicsObject, GraphicsObjectConfig, graphicsObjectDefaults} from "./graphicsobject"
import {Asset, AssetConfig} from "./asset"

export interface Model extends GraphicsObject<"model">{
	asset:Asset<"modelsrc">
	color:Color
}

export interface ModelConfig extends GraphicsObjectConfig<"model">{
	asset:AssetConfig<"modelsrc">
	color?:Color
}

export const modelDefaults:Optionals<ModelConfig> = {
	...graphicsObjectDefaults,
	color:{r:1, g:1, b:1}
}