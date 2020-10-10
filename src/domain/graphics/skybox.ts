
import {Asset, LoadAssetFunction} from "./asset"

export class Skybox implements Asset<"skybox">{
	kind:"skybox"
}

export interface SkyboxLoader{
	load:LoadAssetFunction<Skybox>
}