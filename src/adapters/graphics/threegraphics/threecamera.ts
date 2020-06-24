
import {Camera, CameraConfig, cameraDefaults} from "domain/graphics/camera"
import {ThreeGraphicsObject, threeObjectFactory} from "./threegraphicsobject"
import {SceneInfo} from "./sceneinfo"
import * as THREE from "three"

export class ThreeCamera extends ThreeGraphicsObject<"camera"> implements Camera{

	threeObject:THREE.PerspectiveCamera

	set nearClip(nc:number){
		this.threeObject.near = nc
		this.threeObject.updateProjectionMatrix()
	}

	set farClip(fc:number){
		this.threeObject.far = fc
		this.threeObject.updateProjectionMatrix()
	}

	set verticalAngleOfViewInDeg(aov:number){
		this.threeObject.fov = aov
		this.threeObject.updateProjectionMatrix()
	}

	constructor(scene:THREE.Scene, config:CameraConfig){
		const filledConfig:Required<CameraConfig> =
			{...cameraDefaults, ...config}
		super()

		this.threeScene = scene
		this.threeObject = new THREE.PerspectiveCamera()

		Object.assign(this, filledConfig)

		this.threeScene.add(this.threeObject)
	}

	activate(){
		;(this.threeScene.userData as SceneInfo).activeCamera = this.threeObject
	}
}

threeObjectFactory.register("camera", ThreeCamera)