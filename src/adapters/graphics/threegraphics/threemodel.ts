
import {Asset, LoadAssetFunction} from "domain/graphics/asset"
import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export class ThreeModel implements Asset<"model">{
	kind:"model" = "model"
	threeObject:THREE.Object3D = undefined
}

const gltfLoader = new GLTFLoader()

export let loadThreeModel:LoadAssetFunction<"model"> = function(
	file: string,
	onLoaded?:()=>void,
	onError?:(err:ErrorEvent)=>void
){
	let model = new ThreeModel()

	gltfLoader.load(
		file,
		function(gltf){
			model.threeObject = gltf.scene
			onLoaded()
		},
		undefined,
		onError
	)

	return model
}
