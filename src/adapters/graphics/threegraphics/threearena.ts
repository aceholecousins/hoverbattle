
import {Model, ModelLoader} from "domain/graphics/model"
import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { Arena, ArenaLoader, ArenaInfo } from "domain/graphics/arena"
import { ThreeModel, ThreeModelLoader } from "./threemodel"
import { vec2 } from "gl-matrix"
import { TriangleCorners } from "domain/physics/triangle"

export class ThreeArena extends Arena{
	threeObject:THREE.Object3D = undefined
}

function extractBoundary(scene:THREE.Scene){
	let tris:TriangleCorners[] = []

	for(let node of scene.children){
		console.log(node)
		if(node.name.startsWith("__collision__")){
			node.updateMatrixWorld()
			let bufGeom = ((node as THREE.Mesh).geometry as THREE.BufferGeometry).toNonIndexed()
			let geom = new THREE.Geometry().fromBufferGeometry(bufGeom)
			let verts = geom.vertices

			for(let i=0; i<verts.length; i+=3){	
				let va = node.localToWorld(verts[i])
				let A = vec2.fromValues(va.x, va.y)
				let vb = node.localToWorld(verts[i+1])
				let B = vec2.fromValues(vb.x, vb.y)
				let vc = node.localToWorld(verts[i+2])
				let C = vec2.fromValues(vc.x, vc.y)				
				tris.push([A, B, C])
			}

			scene.remove(node)
			;(node as THREE.Mesh).geometry.dispose()
		}
	}

	return tris
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
					let boundary = extractBoundary(model.threeObject as THREE.Scene)
					onLoaded({boundary})
				}
			},
			onError
		)

		return arena
	}
}
