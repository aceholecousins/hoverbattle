
import {Mesh, MeshConfig, ModelMeshConfig, MeshFactory} from "domain/graphics/mesh"
import {ThreeSceneNode} from "./threescenenode"
import * as THREE from "three"
import {Color} from "utils"
import {ThreeModel} from "./threemodel"

function colorRecursive(obj: THREE.Object3D, col:Color){
	if(obj.type == "mesh"){
		((obj as THREE.Mesh).material as THREE.MeshStandardMaterial).color.setRGB(col.r, col.g, col.b)
	}
	
	for(let c of obj.children){
		colorRecursive(c, col)
	}
}

export class ThreeMesh extends ThreeSceneNode<"mesh"> implements Mesh{

	threeObject:THREE.Object3D

	set baseColor(col:Color){
		// TODO: proper filtering which parts to color and whether to color diffuse or emissive
		colorRecursive(this.threeObject, col)
	}

	set accentColor(col:Color){
		colorRecursive(this.threeObject, col)
	}

	constructor(scene:THREE.Scene, template:THREE.Object3D, config:MeshConfig){
		super(scene, template.clone(), config)
		
		this.baseColor = config.baseColor
		this.accentColor = config.accentColor
	}
}

export class ThreeMeshFactory implements MeshFactory{

	threeScene:THREE.Scene

	constructor(scene:THREE.Scene){
		this.threeScene = scene
	}

	createFromModel(config:ModelMeshConfig){
		return new ThreeMesh(
			this.threeScene,
			(config.asset as ThreeModel).threeObject.clone(),
			config
		)
	}
}