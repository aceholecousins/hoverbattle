
import {Mesh, MeshConfig, ModelMeshConfig, MeshFactory} from "game/graphics/mesh"
import {ThreeSceneNode} from "./threescenenode"
import * as THREE from "three"
import {copy, Color} from "utils"
import {ThreeModel} from "./threemodel"

function colorRecursively(obj: THREE.Object3D, col:Color){
	if(obj.type == "Mesh"){
		((obj as THREE.Mesh).material as THREE.MeshStandardMaterial).color.setRGB(col.r, col.g, col.b)
	}
	
	for(let c of obj.children){
		colorRecursively(c, col)
	}
}

function accentColorRecursively(obj: THREE.Object3D, col:Color){
	if(obj.type == "Mesh"){
		let emit = ((obj as THREE.Mesh).material as THREE.MeshStandardMaterial).emissive
		if(emit.r>0 || emit.g>0 || emit.b>0){
			emit.setRGB(col.r, col.g, col.b)
		}
	}
	
	for(let c of obj.children){
		accentColorRecursively(c, col)
	}
}

function cloneMaterialRecursively(target: THREE.Object3D, source: THREE.Object3D){
	if(target.type == "Mesh"){
		((target as THREE.Mesh).material as THREE.MeshStandardMaterial) =
			((source as THREE.Mesh).material as THREE.MeshStandardMaterial).clone()
	}
	
	for(let ic in target.children){
		cloneMaterialRecursively(target.children[ic], source.children[ic])
	}	
}

export class ThreeMesh extends ThreeSceneNode<"mesh"> implements Mesh{

	threeObject:THREE.Object3D

	set baseColor(col:Color){
		// TODO: proper filtering which parts to color and whether to color diffuse or emissive
		colorRecursively(this.threeObject, col)
	}

	set accentColor(col:Color){
		accentColorRecursively(this.threeObject, col)
	}

	constructor(scene:THREE.Scene, template:THREE.Object3D, config:MeshConfig){
		super(scene, template.clone(), config)
		copy(this, config, ["baseColor", "accentColor"])
	}
}

export class ThreeMeshFactory implements MeshFactory{

	threeScene:THREE.Scene

	constructor(scene:THREE.Scene){
		this.threeScene = scene
	}

	createFromModel(config:ModelMeshConfig){
		let mesh = new ThreeMesh(
			this.threeScene,
			(config.asset as ThreeModel).threeObject.clone(),
			config
		)
		cloneMaterialRecursively(mesh.threeObject, (config.asset as ThreeModel).threeObject)
		return mesh
	}
}