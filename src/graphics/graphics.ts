
import {GraphicsObject, GraphicsObjectConfig} from "./graphicsobject"
import {Asset, AssetConfig} from "./asset"
import {Kind} from "../utils"

export interface Graphics{
	loadAsset<K extends Kind>(config:AssetConfig<K>):Asset<K>
	addObject<K extends Kind>(config:GraphicsObjectConfig<K>):GraphicsObject<K>
	update():void
}