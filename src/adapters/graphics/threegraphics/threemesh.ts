
import { Mesh, ModelMeshConfig, MeshFactory } from "game/graphics/mesh"
import { ThreeSceneNode } from "./threescenenode"
import * as THREE from "three"
import { Color } from "utils/color"
import { ThreeModel } from "./threemodel"
import { modMaterials } from "./shadermods"
import { ThreeWater } from "./threewater"
import { vec3 } from "gl-matrix"

export class ThreeMesh extends ThreeSceneNode<"mesh"> implements Mesh {

	threeObject: THREE.Object3D

	constructor(
		scene: THREE.Scene,
		config: ModelMeshConfig,
		water: ThreeWater
	) {
		let threeModel = config.model as ThreeModel
		let template = threeModel.threeObject
		super(scene, template.clone(), config)

		this.threeObject.userData.tintMatrix = { value: new THREE.Matrix3() }
		modMaterials(this.threeObject, this.threeObject.userData.tintMatrix, water)

		this.setBaseColor(config.baseColor)
		this.setAccentColor1(config.accentColor1)
		this.setAccentColor2(config.accentColor2)
	}

	setBaseColor(color: Color) {
		if (this.threeObject.userData.tintMatrix) {
			let tint = this.threeObject.userData.tintMatrix.value as THREE.Matrix3
			tint.elements[0] = color.r
			tint.elements[1] = color.g
			tint.elements[2] = color.b
		}
	}

	setAccentColor1(color: Color) {
		if (this.threeObject.userData.tintMatrix) {
			let tint = this.threeObject.userData.tintMatrix.value as THREE.Matrix3
			tint.elements[3] = color.r
			tint.elements[4] = color.g
			tint.elements[5] = color.b
		}
	}

	setAccentColor2(color: Color) {
		if (this.threeObject.userData.tintMatrix) {
			let tint = this.threeObject.userData.tintMatrix.value as THREE.Matrix3
			tint.elements[6] = color.r
			tint.elements[7] = color.g
			tint.elements[8] = color.b
		}
	}

	setOpacity(opacity: number) {
		this.threeObject.traverse((obj) => {
			if (obj.type === "Mesh") {
				let mat = (obj as THREE.Mesh).material as THREE.Material
				mat.transparent = opacity < 1 // TODO: this probably fails on objects with transparent parts
				mat.opacity = opacity
			}
		})
	}

	setPosition(position: vec3) {
		super.setPosition(position)
		this.threeObject.renderOrder = position[2]
	}

}

export class ThreeMeshFactory implements MeshFactory {
	threeScene: THREE.Scene
	water: ThreeWater

	constructor(scene: THREE.Scene, water: ThreeWater) {
		this.threeScene = scene
		this.water = water
	}

	createFromModel(config: ModelMeshConfig) {
		let mesh = new ThreeMesh(
			this.threeScene,
			config,
			this.water
		)
		return mesh
	}
}
