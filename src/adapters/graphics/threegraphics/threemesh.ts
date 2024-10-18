
import { Mesh, MeshConfig, ModelMeshConfig, MeshFactory } from "game/graphics/mesh"
import { ThreeSceneNode } from "./threescenenode"
import * as THREE from "three"
import { copy, Color } from "utils"
import { ThreeModel } from "./threemodel"

export class ThreeMesh extends ThreeSceneNode<"mesh"> implements Mesh {

	threeObject: THREE.Object3D

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

	constructor(scene: THREE.Scene, template: THREE.Object3D, config: MeshConfig) {
		super(scene, template.clone(), config)

		this.threeObject.userData.tintMatrix = { value: new THREE.Matrix3() }
		tintMaterials(this.threeObject, this.threeObject.userData.tintMatrix)

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
			(config.model as ThreeModel).threeObject,
			config
		)
		return mesh
	}
}

function tintMaterials(object: THREE.Object3D, uniform: { value: THREE.Matrix3 }) {

	if (object.type === "Mesh") {
		let mesh = object as THREE.Mesh
		let mat = mesh.material as THREE.Material

		if (
			"tintMatrix" in mat.userData // already tinted (material can be referenced by multiple objects)
			|| !mat.userData.useTinting // material does not use tinting
		) {
			return
		}

		mesh.material = mat.clone()
		mat = mesh.material

		mat.userData.tintMatrix = uniform

		if (mat.type === "MeshBasicMaterial") {
			let obcBefore = mat.onBeforeCompile
			mat.onBeforeCompile = (shader, renderer) => {
				if (obcBefore !== undefined) {
					obcBefore(shader, renderer)
				}

				shader.uniforms['tint'] = uniform
				shader.fragmentShader = shader.fragmentShader.replace(
					"void main() {",
					"uniform mat3 tint;\n" +
					"void main() {"
				).replace(
					"vec3 outgoingLight = reflectedLight.indirectDiffuse;",
					"vec3 outgoingLight = tint * reflectedLight.indirectDiffuse;"
				)
				console.assert(
					shader.fragmentShader.includes("mat3 tint;")
					&& shader.fragmentShader.includes("tint * ref"),
					"tint injection failed, shader code must have changed"
				);
			}
		}
		else if (mat.type === "MeshStandardMaterial") {
			let obcBefore = mat.onBeforeCompile
			mat.onBeforeCompile = (shader, renderer) => {
				if (obcBefore !== undefined) {
					obcBefore(shader, renderer)
				}

				shader.uniforms['tint'] = uniform
				shader.fragmentShader = shader.fragmentShader.replace(
					"void main() {",
					"uniform mat3 tint;\n" +
					"void main() {"
				).replace(
					"#include <color_fragment>",
					"#include <color_fragment>\n" +
					"diffuseColor.rgb = tint * diffuseColor.rgb;"
				).replace(
					"#include <emissivemap_fragment>",
					"#include <emissivemap_fragment>\n" +
					"totalEmissiveRadiance = tint * totalEmissiveRadiance;"
				)
				console.assert(
					shader.fragmentShader.includes("mat3 tint;")
					&& shader.fragmentShader.includes("tint * diff")
					&& shader.fragmentShader.includes("tint * total"),
					"tint injection failed, shader code must have changed"
				);
			}
		}
	}

	for (let child of object.children) {
		tintMaterials(child, uniform)
	}
}