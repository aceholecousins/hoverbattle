
import * as THREE from "three"
import { SceneNode, SceneNodeConfig } from "game/graphics/scenenode"
import { Vector2, Vector3, Quaternion } from "math"
import { Kind } from "utils/general"

export abstract class ThreeSceneNode<K extends Kind, T extends THREE.Object3D = THREE.Object3D> implements SceneNode<K> {
	kind: K
	threeScene: THREE.Scene
	threeObject: T

	constructor(
		scene: THREE.Scene,
		object: T,
		config: SceneNodeConfig<K>
	) {
		this.threeScene = scene
		this.threeObject = object
		scene.add(object)

		// let axes = new THREE.AxesHelper(1)
		// this.threeObject.add(axes)

		this.kind = config.kind
		this.setPosition(config.position)
		this.setOrientation(config.orientation)
		this.setScale(config.scale)
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
