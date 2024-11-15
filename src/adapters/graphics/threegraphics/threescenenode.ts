
import * as THREE from "three"
import { SceneNode, SceneNodeConfig } from "game/graphics/scenenode"
import { vec2, vec3, quat } from "gl-matrix"
import { Kind } from "utils/general"

export abstract class ThreeSceneNode<K extends Kind> implements SceneNode<K> {
	kind: K
	threeScene: THREE.Scene
	threeObject: THREE.Object3D

	constructor(
		scene: THREE.Scene,
		object: THREE.Object3D,
		config: SceneNodeConfig<K>
	) {
		this.threeScene = scene
		this.threeObject = object
		scene.add(object)

		this.kind = config.kind
		this.setPosition(config.position)
		this.setOrientation(config.orientation)
		this.setScale(config.scale)
	}

	setPosition(position: vec3) {
		this.threeObject.position.set(position[0], position[1], position[2])
	}

	setPositionXY(xy: vec2) {
		this.threeObject.position.setX(xy[0])
		this.threeObject.position.setY(xy[1])
	}

	setPositionZ(z: number) {
		this.threeObject.position.setZ(z)
	}

	setOrientation(orientation: quat) {
		this.threeObject.quaternion.set(
			orientation[0], orientation[1], orientation[2], orientation[3])
	}

	setAngle(angle: number) {
		this.threeObject.rotation.set(0, 0, angle)
	}

	copy2dPose(source: { position: vec2, angle: number }) {
		this.setPositionXY(source.position)
		this.setAngle(source.angle)
	}

	setScale(scale: number | vec3) {
		if (typeof scale === "number") {
			this.threeObject.scale.setScalar(scale)
		}
		else {
			this.threeObject.scale.set(scale[0], scale[1], scale[2])
		}
	}

	destroy() {
		this.threeScene.remove(this.threeObject)
	}
}
