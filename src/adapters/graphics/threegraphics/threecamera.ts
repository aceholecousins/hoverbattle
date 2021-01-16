
import {ThreeSceneNode} from "./threescenenode"
import {Camera, CameraConfig, CameraFactory} from "game/graphics/camera"
import {SceneInfo} from "./sceneinfo"
import * as THREE from "three"
import {copy} from "utils"
import { renderer } from "./threerenderer"
import { PerspectiveCamera } from "three"

export class ThreeCamera extends ThreeSceneNode<"camera"> implements Camera{

	threeObject:THREE.PerspectiveCamera
	_onAspectChange: (aspect:number)=>void

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

	set onAspectChange(cb:(aspect:number)=>void){
		this._onAspectChange = cb
		cb((this.threeObject as THREE.PerspectiveCamera).aspect)
	}

	get onAspectChange(){
		return this._onAspectChange
	}

	constructor(scene:THREE.Scene, config:CameraConfig){
		let threeCam = new THREE.PerspectiveCamera()

		super(scene, threeCam, config)
		copy(this, config, ["nearClip", "farClip", "verticalAngleOfViewInDeg", "onAspectChange"])

		const resize = ()=>{
			let aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight
			threeCam.aspect = aspect
			threeCam.updateProjectionMatrix()
			this.onAspectChange(aspect)
		}
		
		window.addEventListener('resize', resize)
		resize()		
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