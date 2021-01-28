
import { Mesh, MeshConfig, ModelMeshConfig, MeshFactory } from "game/graphics/mesh"
import { ThreeSceneNode } from "./threescenenode"
import * as THREE from "three"
import { copy, Color } from "utils"
import { ThreeModel } from "./threemodel"

export class ThreeMesh extends ThreeSceneNode<"mesh"> implements Mesh {

	threeObject: THREE.Object3D

	set baseColor(col: Color) {
		if ("tint" in this.threeObject.userData) {
			let tint = this.threeObject.userData.tint.value as THREE.Matrix3
			tint.elements[0] = col.r
			tint.elements[1] = col.g
			tint.elements[2] = col.b
		}
	}

	set accentColor1(col: Color) {
		if ("tint" in this.threeObject.userData) {
			let tint = this.threeObject.userData.tint.value as THREE.Matrix3
			tint.elements[3] = col.r
			tint.elements[4] = col.g
			tint.elements[5] = col.b
		}
	}

	set accentColor2(col: Color) {
		if ("tint" in this.threeObject.userData) {
			let tint = this.threeObject.userData.tint.value as THREE.Matrix3
			tint.elements[6] = col.r
			tint.elements[7] = col.g
			tint.elements[8] = col.b
		}
	}

	constructor(scene: THREE.Scene, template: THREE.Object3D, config: MeshConfig) {
		super(scene, template.clone(), config)

		cloneMaterialRecursively(this.threeObject, template)
		copy(this, config, ["baseColor", "accentColor1", "accentColor2"])
	}
}

export class ThreeMeshFactory implements MeshFactory {
	threeScene: THREE.Scene

	constructor(scene: THREE.Scene) {
		this.threeScene = scene
	}

	createFromModel(config: ModelMeshConfig) {
		let mesh = new ThreeMesh(
			this.threeScene,
			(config.asset as ThreeModel).threeObject,
			config
		)
		return mesh
	}
}

function cloneMaterialRecursively(
	target: THREE.Object3D,
	source: THREE.Object3D, 
	tintUniform?: {value: THREE.Matrix3}
) {
	let tint = tintUniform
	if ("tint" in source.userData) {
		tint = { value: source.userData.tint.value.clone() }
		target.userData.tint = tint
	}

	if (target.type == "Mesh") {
		; ((target as THREE.Mesh).material as THREE.Material) =
			((source as THREE.Mesh).material as THREE.Material).clone()
		
		if(
			tint !== undefined && 
			((target as THREE.Mesh).material as THREE.Material).name.slice(-6) == "__tint"
		){
			injectTint(
				((target as THREE.Mesh).material as THREE.Material),
				tint
			)
		}
	}

	for (let ic in target.children) {
		cloneMaterialRecursively(target.children[ic], source.children[ic], tint)
	}
}

function injectTint(mat: THREE.Material, uniform: {value: THREE.Matrix3}){
	if("tint" in mat.userData){ // already done
		return
	}

	mat.userData.tint = uniform

	let obcBefore = mat.onBeforeCompile
	mat.onBeforeCompile = (shader, renderer)=>{
		if(obcBefore !== undefined){
			obcBefore(shader, renderer)
		}

		shader.uniforms['tint'] = uniform
		shader.fragmentShader = shader.fragmentShader.replace(
			"void main() {",
			"uniform mat3 tint;\nvoid main() {"
		).replace(
			"#include <color_fragment>",
			"#include <color_fragment>\ndiffuseColor.rgb = tint * diffuseColor.rgb;"
		).replace(
			"#include <emissivemap_fragment>",
			"#include <emissivemap_fragment>\ntotalEmissiveRadiance = tint * totalEmissiveRadiance;"
		)
	}
}