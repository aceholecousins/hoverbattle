
import { Model, ModelLoader, ModelMetaData } from "game/graphics/asset"
import { vec3, quat } from "gl-matrix"
import * as THREE from "three"
import { Vector3 } from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Triangle3 } from "utilities/math_utils"
import { SceneNodeConfig } from "game/graphics/scenenode"

export class ThreeModel extends Model {
	threeObject: THREE.Object3D = undefined
}

export interface ThreeModelLoader extends ModelLoader {
	(file: string): Promise<{ model: ThreeModel; meta: ModelMetaData }>;
}

export const loadThreeModel: ThreeModelLoader = function (file: string) {
	return new Promise<{ model: ThreeModel; meta: ModelMetaData }>(
		(resolve, reject) => {
			let model = new ThreeModel()

			new GLTFLoader().load(
				file,
				function (gltf) {
					model.threeObject = gltf.scene
					adaptModel(model.threeObject)
					let meta = extractMetaData(model.threeObject as THREE.Scene)
					resolve({ model, meta })
				},
				undefined,
				reject
			)
		}
	)
}

function adaptModel(
	obj: THREE.Object3D,
	root: THREE.Object3D = obj,
	completed: Set<THREE.Material> = new Set<THREE.Material>()
) {
	if (obj === root) {
		obj.userData.tint = { value: new THREE.Matrix3() }
	}

	// we don't inject the tinting mod into the template because it has to be
	// linked to the tinting matrix uniform of each cloned material so it will
	// be injected during cloning

	if (obj.type == "Mesh") {
		let mesh = obj as THREE.Mesh
		let mat = mesh.material as THREE.Material

		if (mat !== undefined && !completed.has(mat)) {
			if ("normalMapType" in mat) {
				; (mat as THREE.MeshStandardMaterial).normalMapType =
					THREE.ObjectSpaceNormalMap
			}
		}
	}

	for (let child of obj.children) {
		adaptModel(child, root, completed)
	}
}

function extractMetaData(scene: THREE.Scene) {
	let meta: ModelMetaData = {}

	for (let node of scene.children) {
		if (node.name[0] == "_") {
			if (node.type == "Mesh") {
				let tris: Triangle3[] = []

				node.updateMatrixWorld()
				let bufGeom = ((node as THREE.Mesh).geometry as THREE.BufferGeometry).toNonIndexed()
				let verts = bufGeom.getAttribute('position');

				for (let i = 0; i < verts.count; i += 3) {
					let va = node.localToWorld(getVertex(verts, i))
					let A = vec3.fromValues(va.x, va.y, va.z)
					let vb = node.localToWorld(getVertex(verts, i + 1))
					let B = vec3.fromValues(vb.x, vb.y, vb.z)
					let vc = node.localToWorld(getVertex(verts, i + 2))
					let C = vec3.fromValues(vc.x, vc.y, vc.z)
					tris.push([A, B, C])
				}
				meta[node.name.substring(1)] = tris
				scene.remove(node);
				(node as THREE.Mesh).geometry.dispose()
			}
			else if (node.type == "Object3D") {
				const p = node.position
				const q = node.quaternion
				const s = node.scale
				meta[node.name.substring(1)] = new SceneNodeConfig({
					kind: "empty",
					position: vec3.fromValues(p.x, p.y, p.z),
					orientation: quat.fromValues(q.x, q.y, q.z, q.w),
					scaling: vec3.fromValues(s.x, s.y, s.z)
				})
				scene.remove(node);
			}
			else {
				throw new Error("Error loading model meta data: unhandled node type " + node.type)
			}
		}
	}

	return meta
}

function getVertex(
	attribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
	index: number) {
	return new Vector3(
		attribute.getX(index),
		attribute.getY(index),
		attribute.getZ(index))
}