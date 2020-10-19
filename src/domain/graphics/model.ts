
import {Asset, LoadAssetFunction} from "./asset"
import { Triangle3 } from "utilities/math_utils"

export class Model implements Asset<"model">{
	kind:"model"
}

export interface ModelMetaData{
	[key:string]:Triangle3[]
}

export interface ModelLoader{
	load:LoadAssetFunction<Model, ModelMetaData>
}