
import * as THREE from "three"
import { SceneNode, SceneNodeConfig, sceneNodeDefaults } from "game/graphics/scenenode"
import { Vector2, Vector3, Quaternion } from "math"

export abstract class ThreeSceneNode<T extends THREE.Object3D = THREE.Object3D> implements SceneNode {
	kind: string
	threeScene: THREE.Scene
	threeObject: T

	constructor(
		scene: THREE.Scene,
		object: T,
		config: SceneNodeConfig
	) {
		const fullConfig: Required<SceneNodeConfig> = {...sceneNodeDefaults, ...config}
		this.threeScene = scene
		this.threeObject = object
		scene.add(object)

		// let axes = new THREE.AxesHelper(1)
		// this.threeObject.add(axes)

		this.kind = fullConfig.kind
		this.setPosition(fullConfig.position)
		this.setOrientation(fullConfig.orientation)
		this.setScale(fullConfig.scale)
	}

	setPosition(position: Vector3) {
		this.threeObject.position.copy(position)
	}

	setPositionXY(xy: Vector2) {
		this.threeObject.position.setX(xy.x)
		this.threeObject.position.setY(xy.y)
	}

	setPositionZ(z: number) {
		this.threeObject.position.setZ(z)
	}

	setOrientation(orientation: Quaternion) {
		this.threeObject.quaternion.copy(orientation)
	}

	setAngle(angle: number) {
		this.threeObject.rotation.set(0, 0, angle)
	}

	copy2dPose(source: {
		getPosition(): Vector2
		getAngle(): number
	}) {
		this.setPositionXY(source.getPosition())
		this.setAngle(source.getAngle())
	}

	setScale(scale: number | Vector3) {
		if (typeof scale === "number") {
			this.threeObject.scale.setScalar(scale)
		}
		else {
			this.threeObject.scale.copy(scale)
		}
	}

	destroy() {
		this.threeScene.remove(this.threeObject)
	}
}
