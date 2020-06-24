
import {Asset, AssetConfig} from "domain/graphics/asset"
import {threeAssetFactory} from "./threeasset"
import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const gltfLoader = new GLTFLoader()

export class ThreeModelAsset implements Asset<"model">{
	kind:"model"
	model:THREE.Object3D
	
	constructor(
		config:AssetConfig<"model">,
		onLoaded:()=>void,
		onError:(err:ErrorEvent)=>void
	){
		this.model = null
		const that = this
		
		gltfLoader.load(
			config.file,
			function(gltf){
				that.model = gltf.scene
				onLoaded()
			},
			(e)=>{},
			onError
		)
	}
}

threeAssetFactory.register("model", ThreeModelAsset)