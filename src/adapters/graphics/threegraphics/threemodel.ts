
import {Model, ModelLoader} from "domain/graphics/model"
import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export class ThreeModel extends Model{
	threeObject:THREE.Object3D = undefined
}

const gltfLoader = new GLTFLoader()

export class ThreeModelLoader implements ModelLoader{
	load(
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
}