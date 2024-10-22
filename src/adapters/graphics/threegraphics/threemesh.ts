
import { Mesh, MeshConfig, ModelMeshConfig, MeshFactory } from "game/graphics/mesh"
import { ThreeSceneNode } from "./threescenenode"
import * as THREE from "three"
import { copy, Color } from "utils"
import { ThreeModel } from "./threemodel"
import { modMaterials } from "./shadermods"

export class ThreeMesh extends ThreeSceneNode<"mesh"> implements Mesh {

	threeObject: THREE.Object3D

	constructor(scene: THREE.Scene, template: THREE.Object3D, config: MeshConfig) {
		super(scene, template.clone(), config)

		this.threeObject.userData.tintMatrix = { value: new THREE.Matrix3() }
		modMaterials(this.threeObject, this.threeObject.userData.tintMatrix)

		copy(this, config, ["baseColor", "accentColor1", "accentColor2"])
	}

	set baseColor(col: Color) {
		if (this.threeObject.userData.tintMatrix) {
			let tint = this.threeObject.userData.tintMatrix.value as THREE.Matrix3
			tint.elements[0] = col.r
			tint.elements[1] = col.g
			tint.elements[2] = col.b
		}
	}

	set accentColor1(col: Color) {
		if (this.threeObject.userData.tintMatrix) {
			let tint = this.threeObject.userData.tintMatrix.value as THREE.Matrix3
			tint.elements[3] = col.r
			tint.elements[4] = col.g
			tint.elements[5] = col.b
		}
	}

	set accentColor2(col: Color) {
		if (this.threeObject.userData.tintMatrix) {
			let tint = this.threeObject.userData.tintMatrix.value as THREE.Matrix3
			tint.elements[6] = col.r
			tint.elements[7] = col.g
			tint.elements[8] = col.b
		}
	}

	set opacity(op: number) {
		this.threeObject.traverse((obj) => {
			if (obj.type === "Mesh") {
				let mat = (obj as THREE.Mesh).material as THREE.Material
				mat.transparent = op < 1
				mat.opacity = op
			}
		})
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
			(config.model as ThreeModel).threeObject,
			config
		)
		return mesh
	}
}
