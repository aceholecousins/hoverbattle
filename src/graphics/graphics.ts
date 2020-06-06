
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

	addObject<K extends Kind, GO extends GraphicsObject<K>>(
		config:GraphicsObjectConfig<K, GO>
	):GO
	
	update(time:number):void
}