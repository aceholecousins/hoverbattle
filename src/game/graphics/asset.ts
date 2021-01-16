
import {Kind} from "utils"

export interface Asset<K extends Kind>{
	kind:K
}

// we want to allow to pass info about the loaded asset back via callback parameter
// so it can travel through the worker bridge (a return value can only be a proxy, no data)
export type LoadAssetFunction<T extends Asset<any>, M=void> = (
	file: string,
	onLoaded?: M extends void? ()=>void : (meta:M)=>void,
	onError?:(err:ErrorEvent)=>void
) => T
