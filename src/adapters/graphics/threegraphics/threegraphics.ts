
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
import { ThreeSkyboxLoader } from "./threeskybox"

export class ThreeGraphics implements Graphics{

	canvas:HTMLCanvasElement
	renderer:THREE.WebGLRenderer
	scene:THREE.Scene

	model: ThreeModelLoader
	skybox: ThreeSkyboxLoader

	camera: ThreeCameraFactory
	light: ThreeLightFactory
	mesh: ThreeMeshFactory

	control: GraphicsController

	constructor(canvas:HTMLCanvasElement){
		const that = this

		this.canvas = canvas
		this.renderer = new THREE.WebGLRenderer({canvas:canvas})
		this.scene = new THREE.Scene()
		//@ts-ignore
		window["scene"] = this.scene

		this.model = new ThreeModelLoader()
		this.skybox = new ThreeSkyboxLoader()

		this.camera = new ThreeCameraFactory(this.scene)
		this.light = new ThreeLightFactory(this.scene)
		this.mesh = new ThreeMeshFactory(this.scene)


		// controllable test camera
		let defaultCam = this.camera.create(new CameraConfig())
		defaultCam.position = vec3.fromValues(0, 0, 10)
		defaultCam.activate()
		defaultCam.threeObject.up.set(0, 0, 1)
		this.scene.add(defaultCam.threeObject)

		const controls = new OrbitControls(defaultCam.threeObject, this.renderer.domElement)
		controls.screenSpacePanning = true

		// default lighting
		//this.scene.add(new THREE.HemisphereLight("white", "black"))

		// origin
		//this.scene.add(new THREE.AxesHelper())

		/*
		let sphere = new THREE.Mesh(
			new THREE.SphereGeometry(10, 32, 32),
			new THREE.MeshStandardMaterial()
		)
		this.scene.add(sphere)
		*/
		

		this.control = new ThreeGraphicsController(this)
	}

}
