
import { Mesh, ModelMeshConfig, MeshFactory, modelMeshDefaults } from "game/graphics/mesh"
import { ThreeSceneNode } from "./threescenenode"
import * as THREE from "three"
import { Color } from "utils/color"
import { ThreeModel } from "./threemodel"
import { modMaterials } from "./shadermods"
import { ThreeWater } from "./threewater"
import { Vector3 } from "math"
import { assertDefined } from "utils/general"

export class ThreeMesh extends ThreeSceneNode implements Mesh {

	constructor(
		scene: THREE.Scene,
		config: ModelMeshConfig,
		water: ThreeWater
	) {
		const fullConfig: Required<ModelMeshConfig> = { ...modelMeshDefaults, ...config }
		let threeModel = fullConfig.model as ThreeModel
		let template = threeModel.threeObject
		assertDefined(template)
		super(scene, template.clone(), fullConfig)

		this.threeObject.userData.tintMatrix = { value: new THREE.Matrix3() }
		modMaterials(this.threeObject, this.threeObject.userData.tintMatrix, water)

		this.setBaseColor(fullConfig.baseColor)
		this.setAccentColor1(fullConfig.accentColor1)
		this.setAccentColor2(fullConfig.accentColor2)
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

	setPosition(position: Vector3) {
		super.setPosition(position)
		this.threeObject.renderOrder = position.z
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
