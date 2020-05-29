
import {Kind} from "../utils"

export interface Asset<K extends Kind>{
	kind:K
	file:string
}

export interface AssetConfig<K extends Kind>{
	kind:K
	file:string
}