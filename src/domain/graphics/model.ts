
import {Color, Optionals} from "utils"
import {GraphicsObject, GraphicsObjectConfig, graphicsObjectDefaults} from "./graphicsobject"
import {Asset} from "./asset"

export interface Model extends GraphicsObject<"model">{
	color:Color
}

export interface ModelConfig extends GraphicsObjectConfig<"model">{
	asset:Asset<"model">
	color?:Color
}

export const modelDefaults:Optionals<ModelConfig> = {
	...graphicsObjectDefaults,
	color:{r:1, g:1, b:1}
}