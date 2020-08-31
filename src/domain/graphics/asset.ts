
import {Kind} from "utils"

export interface Asset<K extends Kind>{
	kind:K
}

export type LoadAssetFunction<T extends Asset<any>> = (
	file: string,
	onLoaded?:()=>void,
	onError?:(err:ErrorEvent)=>void
) => T
