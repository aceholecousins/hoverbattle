
import {GraphicsObject, GraphicsObjectConfig} from "./graphicsobject"
import {Asset, AssetConfig} from "./asset"
import {Kind} from "../utils"
import {Camera} from "./camera"

export interface Graphics{

	loadAsset<K extends Kind>(
		config:AssetConfig<K>,
		onLoaded?:()=>void,
		onError?:(err:ErrorEvent)=>void
	):Asset<K>

	addObject<K extends Kind>(
		config:GraphicsObjectConfig<K>
	):GraphicsObject<K>
	
	update(time:number):void
}