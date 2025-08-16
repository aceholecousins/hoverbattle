
import { ThreeSceneNode } from "./threescenenode"
import { Camera, CameraConfig, cameraDefaults, CameraFactory } from "game/graphics/camera"
import { SceneInfo } from "./sceneinfo"
import * as THREE from "three"
import { renderer } from "./threerenderer"

export class ThreeCamera extends ThreeSceneNode<"camera", THREE.PerspectiveCamera> implements Camera {

	onAspectChange: (aspect: number) => void

	constructor(scene: THREE.Scene, config: CameraConfig) {
		let threeCam = new THREE.PerspectiveCamera()
		const fullConfig: Required<CameraConfig> = {...cameraDefaults, ...config}

		super(scene, threeCam, fullConfig)

		this.threeObject.near = fullConfig.nearClip
		this.threeObject.far = fullConfig.farClip
		this.threeObject.fov = fullConfig.verticalAngleOfViewInDeg
		this.threeObject.updateProjectionMatrix()
		this.onAspectChange = fullConfig.onAspectChange

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