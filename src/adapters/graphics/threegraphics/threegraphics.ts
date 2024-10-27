
import { vec3 } from "gl-matrix"

import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Graphics } from "game/graphics/graphics"
import { CameraConfig } from "game/graphics/camera"

import { renderer } from "./threerenderer"
import { SceneInfo } from "./sceneinfo"

import { ThreeModelLoader, loadThreeModel } from "./threemodel"
import { ThreeSkyboxLoader, loadThreeSkybox } from "./threeskybox"
import { ThreeSpriteLoader, loadThreeSprite } from "./threesprite"

import { ThreeCameraFactory } from "./threecamera"
import { ThreeLightFactory } from "./threelight"
import { ThreeMeshFactory } from "./threemesh"

import { ThreeWater } from "./threewater"

import { Skybox } from "game/graphics/asset"
import { ThreeSkybox } from "./threeskybox"

//@ts-ignore
window.three = THREE

export class ThreeGraphics implements Graphics {

	scene: THREE.Scene

	loadModel: ThreeModelLoader
	loadSprite: ThreeSpriteLoader
	loadSkybox: ThreeSkyboxLoader

	camera: ThreeCameraFactory
	light: ThreeLightFactory
	mesh: ThreeMeshFactory
	
	water: ThreeWater

	setEnvironment(env: Skybox) {
		this.scene.background = (env as ThreeSkybox).threeCubemap
		this.scene.environment = (env as ThreeSkybox).threePmrem
	}

	setEnvironmentOrientation(ypr: vec3) {
		this.scene.backgroundRotation.set(ypr[2], ypr[1], ypr[0], "XYZ")
		this.scene.environmentRotation.set(ypr[2], ypr[1], ypr[0], "XYZ")
	}

	update() {
		this.water.render(
			(this.scene.userData as SceneInfo).activeCamera
		)
		renderer.render(
			this.scene,
			(this.scene.userData as SceneInfo).activeCamera
		)
	}

	constructor() {

		this.scene = new THREE.Scene()
		//@ts-ignore
		window["scene"] = this.scene

		this.loadModel = loadThreeModel
		this.loadSprite = loadThreeSprite
		this.loadSkybox = loadThreeSkybox

		this.camera = new ThreeCameraFactory(this.scene)

		// controllable test camera
		let defaultCam = this.camera.create(new CameraConfig())
		defaultCam.position = vec3.fromValues(0, 0, 10)
		defaultCam.activate()
		defaultCam.threeObject.up.set(0, 0, 1)
		this.scene.add(defaultCam.threeObject)

		this.water = new ThreeWater()

		this.light = new ThreeLightFactory(this.scene)
		this.mesh = new ThreeMeshFactory(this.scene, this.water)

		const controls = new OrbitControls(defaultCam.threeObject, renderer.domElement)
		controls.screenSpacePanning = true

		// origin
		//this.scene.add(new THREE.AxesHelper())

		const resize = () => {
			let w = renderer.domElement.clientWidth
			let h = renderer.domElement.clientHeight
			renderer.setSize(w, h, false)
			this.water.setSize(w, h)
		}

		window.addEventListener('resize', resize)
		resize()
	}

}
