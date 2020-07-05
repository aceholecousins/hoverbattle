
import {Kind} from "utils"

export interface Asset<K extends Kind>{
	kind:K
}

export interface AssetLoader{
	load: <K extends Kind>(
		kind: Kind,
		file: string,
		onLoaded?:()=>void,
		onError?:(err:ErrorEvent)=>void
	) => Asset<K>
}
