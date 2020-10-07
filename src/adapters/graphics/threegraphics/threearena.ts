
import {Model, ModelLoader} from "domain/graphics/model"
import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { Arena, ArenaLoader, ArenaInfo } from "domain/graphics/arena"
import { ThreeModel, ThreeModelLoader } from "./threemodel"

export class ThreeArena extends Arena{
	threeObject:THREE.Object3D = undefined
}

// we delegate everything to the ThreeModelLoader but extract the information we need

export class ThreeArenaLoader implements ArenaLoader{
	load(
		file: string,
		onLoaded?:(info:ArenaInfo)=>void,
		onError?:(err:ErrorEvent)=>void
	){
		let arena = new ThreeArena()
		let modelLoader = new ThreeModelLoader()

		let model = modelLoader.load(
			file,
			function(){
				arena.threeObject = model.threeObject
				if(onLoaded !== undefined){
					onLoaded({boundary:[]})
				}
			},
			onError
		)

		return arena
	}
}

/*export class ThreeModelLoader implements ModelLoader{
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
				processModel(model.threeObject)
				onLoaded()
			},
			undefined,
			onError
		)
	
		return model
	}
}
*/