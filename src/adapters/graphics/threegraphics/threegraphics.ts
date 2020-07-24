
import {vec3} from "gl-matrix"

import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {Graphics} from "domain/graphics/graphics"
import {GraphicsController} from "domain/graphics/graphicscontroller"
import {CameraConfig} from "domain/graphics/camera"

import {SceneInfo} from "./sceneinfo"

import {ThreeModelLoader} from "./threemodel"

import {ThreeCameraFactory, ThreeCamera} from "./threecamera"
import {ThreeLightFactory} from "./threelight"
import {ThreeMeshFactory} from "./threemesh"

import {ThreeGraphicsController} from "./threegraphicscontroller"

export class ThreeGraphics implements Graphics{

	canvas:HTMLCanvasElement
	renderer:THREE.WebGLRenderer
	scene:THREE.Scene

	model: ThreeModelLoader

	camera: ThreeCameraFactory
	light: ThreeLightFactory
	mesh: ThreeMeshFactory
	//environment: EnvironmentFactory
	control: GraphicsController

	constructor(canvas:HTMLCanvasElement){
		const that = this

		this.canvas = canvas
		this.renderer = new THREE.WebGLRenderer({canvas:canvas})
		this.scene = new THREE.Scene()

		this.model = new ThreeModelLoader()

		this.camera = new ThreeCameraFactory(this.scene)
		this.light = new ThreeLightFactory(this.scene)
		this.mesh = new ThreeMeshFactory(this.scene)


		// controllable test camera
		let defaultCam = this.camera.create(new CameraConfig())
		defaultCam.position = vec3.fromValues(0, 0, 10)
		defaultCam.activate()

		const controls = new OrbitControls(defaultCam.threeObject, this.renderer.domElement)
		controls.screenSpacePanning = true

		// default lighting
		this.scene.add(new THREE.HemisphereLight("white", "black"))

		// origin
		this.scene.add(new THREE.AxesHelper())


		this.control = new ThreeGraphicsController(this)
	}

}
