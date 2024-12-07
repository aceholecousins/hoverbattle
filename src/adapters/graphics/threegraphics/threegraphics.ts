
import { Vector3, Quaternion } from "math"

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
import { Color } from "utils/color"

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

	debugLines: THREE.Line[] = []

	setEnvironment(environment: Skybox) {
		this.scene.background = (environment as ThreeSkybox).threeCubemap
		this.scene.environment = (environment as ThreeSkybox).threePmrem
	}

	setEnvironmentOrientation(orientation: Quaternion) {
		this.scene.backgroundRotation.setFromQuaternion(orientation)
		this.scene.environmentRotation.setFromQuaternion(orientation)
	}

	update() {
		this.water.render(
			(this.scene.userData as SceneInfo).activeCamera
		)
		renderer.render(
			this.scene,
			(this.scene.userData as SceneInfo).activeCamera
		)

		for (const line of this.debugLines) {
			this.scene.remove(line);
			(line.material as THREE.LineBasicMaterial).dispose()
			line.geometry.dispose()
		}
		this.debugLines = []
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
		defaultCam.setPosition(new Vector3(0, 0, 10))
		defaultCam.activate()
		defaultCam.threeObject.up.set(0, 0, 1)
		this.scene.add(defaultCam.threeObject)

		window.addEventListener('keydown', (event) => {
			if (event.key === 'c') {
				defaultCam.activate()
			}
		})

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

	drawDebugLine(points: Vector3[], color: Color): void {
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const material = new THREE.LineBasicMaterial({
			color: new THREE.Color(color.r, color.g, color.b),
			depthTest: false
		})
		const line = new THREE.Line(geometry, material);
		line.renderOrder = Infinity
		this.scene.add(line);
		this.debugLines.push(line)
	}
}
