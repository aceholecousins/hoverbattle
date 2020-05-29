
import {Kind} from "../../utils"
import {Asset} from "../asset"

export interface AssetHandle<K extends Kind> extends Asset<K>{
	index:number
}
