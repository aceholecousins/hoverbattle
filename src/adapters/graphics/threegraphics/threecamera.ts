
import { ThreeSceneNode } from "./threescenenode"
import { Camera, CameraConfig, CameraFactory } from "game/graphics/camera"
import { SceneInfo } from "./sceneinfo"
import * as THREE from "three"
import { renderer } from "./threerenderer"

export class ThreeCamera extends ThreeSceneNode<"camera"> implements Camera {

	threeObject: THREE.PerspectiveCamera
	onAspectChange: (aspect: number) => void

	constructor(scene: THREE.Scene, config: CameraConfig) {
		let threeCam = new THREE.PerspectiveCamera()

		super(scene, threeCam, config)

		this.threeObject.near = config.nearClip
		this.threeObject.far = config.farClip
		this.threeObject.fov = config.verticalAngleOfViewInDeg
		this.threeObject.updateProjectionMatrix()
		this.onAspectChange = config.onAspectChange

		const resize = () => {
			let aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight
			threeCam.aspect = aspect
			threeCam.updateProjectionMatrix()
			this.onAspectChange(aspect)
		}

		window.addEventListener('resize', resize)
		resize()
	}

	activate() {
		; (this.threeScene.userData as SceneInfo).activeCamera = this.threeObject
	}
}

export class ThreeCameraFactory implements CameraFactory {
	threeScene: THREE.Scene

	constructor(scene: THREE.Scene) {
		this.threeScene = scene
	}

	create(config: CameraConfig) {
		return new ThreeCamera(this.threeScene, config)
	}
}