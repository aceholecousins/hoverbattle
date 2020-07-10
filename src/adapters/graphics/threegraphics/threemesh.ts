
import {Mesh, MeshConfig, ModelConfig, MeshFactory} from "domain/graphics/mesh"
import {ThreeGraphicsObject} from "./threegraphicsobject"
import * as THREE from "three"
import {Color} from "utils"
import {ThreeModel} from "./threemodel"

function colorRecursive(obj: THREE.Object3D, col:Color){
	if(obj.type == "mesh"){
		((obj as THREE.Mesh).material as THREE.MeshStandardMaterial).color.copy(col as THREE.Color)
	}
	
	for(let c of obj.children){
		colorRecursive(c, col)
	}
}

export class ThreeMesh extends ThreeGraphicsObject<"mesh"> implements Mesh{

	threeObject:THREE.Mesh

	set baseColor(col:Color){
		// TODO: proper filtering which parts to color and whether to color diffuse or emissive
		colorRecursive(this.threeObject, col)
	}

	set accentColor(col:Color){
		colorRecursive(this.threeObject, col)
	}

	constructor(scene:THREE.Scene, template:THREE.Mesh, config:MeshConfig){
		super(scene, config)
		this.threeObject = template.clone()
		
		this.baseColor = config.baseColor
		this.accentColor = config.accentColor
	}
}

export class ThreeMeshFactory implements MeshFactory{
	createFromModel(config:ModelConfig){


	}
}