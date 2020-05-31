
import {Asset, AssetConfig} from "../asset"
import {threeAssetFactory} from "./threeasset"
import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const gltfLoader = new GLTFLoader()

export class ThreeModelAsset implements Asset<"model">{
	kind:"model"
	model:THREE.Object3D
	
	constructor(config:AssetConfig<"model">){
		this.model = undefined // TODO: loading manager
		const that = this
		gltfLoader.load(
			config.file,
			function(gltf){
				that.model = gltf.scene
			}
		)
	}
}

threeAssetFactory.register("model", ThreeModelAsset)