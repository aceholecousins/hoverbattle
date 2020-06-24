
import {Kind} from "../../../utils"
import {Graphics} from "../../../domain/graphics/graphics"
import {GraphicsObject, GraphicsObjectConfig} from "../../../domain/graphics/graphicsobject"
import {Asset, AssetConfig} from "../../../domain/graphics/asset"
import {threeAssetFactory} from "./threeasset"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {cameraDefaults} from "../../../domain/graphics/camera"
import {SceneInfo} from "./sceneinfo"
import * as THREE from "three"
import { threeObjectFactory } from "./threegraphicsobject"
import "./factorylist"

export class ThreeGraphics implements Graphics{

	canvas:HTMLCanvasElement
	renderer:THREE.Renderer
	scene:THREE.Scene

	constructor(canvas:HTMLCanvasElement){
		this.canvas = canvas
		this.renderer = new THREE.WebGLRenderer({canvas:canvas})
		this.scene = new THREE.Scene()

		// controllable test camera
		const defaultCam = new THREE.PerspectiveCamera(
			cameraDefaults.verticalAngleOfViewInDeg,
			1.0,
			cameraDefaults.nearClip,
			cameraDefaults.farClip
		)
		defaultCam.position.set(0, 0, 10)
		this.scene.add(defaultCam)
		;(this.scene.userData as SceneInfo).activeCamera = defaultCam

		const controls = new OrbitControls(defaultCam, this.renderer.domElement)
		controls.screenSpacePanning = true

		this.scene.add(new THREE.HemisphereLight("white", "black"))
		this.scene.add(new THREE.AxesHelper())

		const that = this
		const resize = ()=>{
			that.renderer.setSize(that.canvas.clientWidth, that.canvas.clientHeight, false)
			const cam = (this.scene.userData as SceneInfo).activeCamera
			cam.aspect = canvas.clientWidth / canvas.clientHeight
			cam.updateProjectionMatrix()
		}
		
		window.addEventListener('resize', resize)
		resize()
	}

	loadAsset<K extends Kind>(
		config:AssetConfig<K>,
		onLoaded?:()=>void,
		onError?:(err:ErrorEvent)=>void
	):Asset<K>{
		return threeAssetFactory.createAsset(config, onLoaded, onError)
	}

	addObject<K extends Kind>(config:GraphicsObjectConfig<K>):GraphicsObject<K>{
		return threeObjectFactory.createObject(this.scene, config)
	}

	update(time:number){
		this.renderer.render(this.scene, (this.scene.userData as SceneInfo).activeCamera)
	}
}
