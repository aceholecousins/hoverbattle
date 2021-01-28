
import {Model, ModelLoader, ModelMetaData} from "game/graphics/model"
import { vec3 } from "gl-matrix"
import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { Triangle3 } from "utilities/math_utils"

export class ThreeModel extends Model{
	threeObject:THREE.Object3D = undefined
}

export class ThreeModelLoader implements ModelLoader{

	load(
		file: string,
		onLoaded?:(meta:ModelMetaData)=>void,
		onError?:(err:ErrorEvent)=>void
	){
		let model = new ThreeModel()

		new GLTFLoader().load(
			file,
			function(gltf){
				model.threeObject = gltf.scene
				adaptModel(model.threeObject)
				let meta = extractMetaData(model.threeObject as THREE.Scene)
				if(onLoaded !== undefined){
					onLoaded(meta)
				}
			},
			undefined,
			onError
		)
	
		return model
	}
}

function adaptModel(
	obj:THREE.Object3D,
	root:THREE.Object3D = obj,
	completed:Set<THREE.Material> = new Set<THREE.Material>()
){
	if(obj === root){
		obj.userData.tint = {value: new THREE.Matrix3()}
	}

	// we don't inject the tinting mod into the template because it has to be
	// linked to the tinting matrix uniform of each cloned material so it will
	// be injected during cloning

	if(obj.type == "Mesh"){
		let mesh = obj as THREE.Mesh
		let mat = mesh.material as THREE.Material
		
		if(mat !== undefined && !completed.has(mat)){
			if ("normalMapType" in mat){
				;(mat as THREE.MeshStandardMaterial).normalMapType =
					THREE.ObjectSpaceNormalMap
			}
		}
	}

	for(let child of obj.children){
		adaptModel(child, root, completed)
	}
}

function extractMetaData(scene:THREE.Scene){
	let meta: ModelMetaData = {}

	for(let node of scene.children){
		if(node.name[0] == "_"){
			let tris:Triangle3[] = []

			node.updateMatrixWorld()
			let bufGeom = ((node as THREE.Mesh).geometry as THREE.BufferGeometry).toNonIndexed()
			let geom = new THREE.Geometry().fromBufferGeometry(bufGeom)
			let verts = geom.vertices

			for(let i=0; i<verts.length; i+=3){	
				let va = node.localToWorld(verts[i])
				let A = vec3.fromValues(va.x, va.y, va.z)
				let vb = node.localToWorld(verts[i+1])
				let B = vec3.fromValues(vb.x, vb.y, va.z)
				let vc = node.localToWorld(verts[i+2])
				let C = vec3.fromValues(vc.x, vc.y, va.z)		
				tris.push([A, B, C])
			}

			meta[node.name.substring(1)] = tris

			scene.remove(node)
			;(node as THREE.Mesh).geometry.dispose()
		}
	}

	return meta
}