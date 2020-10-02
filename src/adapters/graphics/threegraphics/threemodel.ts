
import {Model, ModelLoader} from "domain/graphics/model"
import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export class ThreeModel extends Model{
	threeObject:THREE.Object3D = undefined
}

function processModel(mesh:THREE.Object3D){
	if("material" in mesh && "normalMapType" in (mesh as THREE.Mesh).material){
		((mesh as THREE.Mesh).material as THREE.MeshStandardMaterial).normalMapType =
				THREE.ObjectSpaceNormalMap
	}

	for(let child of mesh.children){
		processModel(child)
	}
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
				processModel(model.threeObject)
				onLoaded()
			},
			undefined,
			onError
		)
	
		return model
	}
}