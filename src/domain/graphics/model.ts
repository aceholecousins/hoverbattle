
import {Asset, LoadAssetFunction} from "./asset"

export class Model implements Asset<"model">{
	kind:"model"
}

export interface ModelLoader{
	load:LoadAssetFunction<Model>
}