
import {Kind} from "utils"

export interface Asset<K extends Kind>{
	kind:K
}

export type LoadAssetFunction<K extends Kind> = (
	kind: Kind,
	file: string,
	onLoaded?:()=>void,
	onError?:(err:ErrorEvent)=>void
) => Asset<K>

export interface AssetLoader{
	loadTexture: LoadAssetFunction<"texture">
	loadCubeTexture: LoadAssetFunction<"cubetexture">
	loadModel: LoadAssetFunction<"model">
}
