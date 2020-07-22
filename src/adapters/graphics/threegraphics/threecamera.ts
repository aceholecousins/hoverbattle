
import {ThreeSceneNode} from "./threescenenode"
import {Camera, CameraConfig, CameraFactory} from "domain/graphics/camera"
import {SceneInfo} from "./sceneinfo"
import * as THREE from "three"

export class ThreeCamera extends ThreeSceneNode<"camera"> implements Camera{

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
		super(scene, new THREE.PerspectiveCamera(), config)

		this.nearClip = config.nearClip
		this.farClip = config.farClip
		this.verticalAngleOfViewInDeg = config.verticalAngleOfViewInDeg
	}

	activate(){
		;(this.threeScene.userData as SceneInfo).activeCamera = this.threeObject
	}
}

export class ThreeCameraFactory implements CameraFactory{
	threeScene:THREE.Scene

	constructor(scene:THREE.Scene){
		this.threeScene = scene
	}

	create(config: CameraConfig){
		return new ThreeCamera(this.threeScene, config)
	}
}