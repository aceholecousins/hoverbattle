
import {vec2, vec3} from "gl-matrix"

import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {Graphics} from "game/graphics/graphics"
import {GraphicsController} from "game/graphics/graphicscontroller"
import {CameraConfig} from "game/graphics/camera"

import {renderer} from "./threerenderer"
import {SceneInfo} from "./sceneinfo"

import {ThreeModelLoader} from "./threemodel"

import {ThreeCameraFactory, ThreeCamera} from "./threecamera"
import {ThreeLightFactory} from "./threelight"
import {ThreeMeshFactory} from "./threemesh"

import {ThreeGraphicsController} from "./threegraphicscontroller"
import { ThreeSkyboxLoader } from "./threeskybox"
import { ThreeSpriteLoader } from "./threesprite"
import { FxFactory } from "game/graphics/fx"
import { ThreeFxFactory } from "./threefx"

//@ts-ignore
window.three = THREE

export class ThreeGraphics implements Graphics{

	scene:THREE.Scene

	model: ThreeModelLoader
	skybox: ThreeSkyboxLoader
	sprite: ThreeSpriteLoader

	camera: ThreeCameraFactory
	light: ThreeLightFactory
	mesh: ThreeMeshFactory

	fx: ThreeFxFactory

	control: GraphicsController

	constructor(){
		
		this.scene = new THREE.Scene()
		//@ts-ignore
		window["scene"] = this.scene

		this.model = new ThreeModelLoader()
		this.skybox = new ThreeSkyboxLoader()
		this.sprite = new ThreeSpriteLoader()

		this.camera = new ThreeCameraFactory(this.scene)
		this.light = new ThreeLightFactory(this.scene)
		this.mesh = new ThreeMeshFactory(this.scene)

		this.fx = new ThreeFxFactory(this.scene)

		// controllable test camera
		let defaultCam = this.camera.create(new CameraConfig())
		defaultCam.position = vec3.fromValues(0, 0, 10)
		defaultCam.activate()
		defaultCam.threeObject.up.set(0, 0, 1)
		this.scene.add(defaultCam.threeObject)

		const controls = new OrbitControls(defaultCam.threeObject, renderer.domElement)
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
