
import * as THREE from 'three'

export class GraphicsManager{

	constructor(canvasId:string){
		this.canvas = <HTMLCanvasElement>document.getElementById(canvasId)
		window.addEventListener('resize', this.resize.bind(this))
	}

	setup(){
		this.renderer = new THREE.WebGLRenderer({canvas:this.canvas})
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(50, 1.0, 0.1, 100)
		this.camera.position.set(0, 0, 10)
		this.scene.add(this.camera)
		this.resize()
	}

	setBackground(background:THREE.Color|THREE.Texture){
		this.scene.background = background
	}

	setCamera(camera:THREE.Camera){
		this.camera = camera
		this.resize()
	}

	addToScene(object:THREE.Object3D){
		this.scene.add(object)
	}

	removeFromScene(object:THREE.Object3D){
		this.scene.remove(object)
	}

	resize(){
		if(this.renderer !== null){
			this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false)
		}
		if(this.camera !== null && this.camera instanceof THREE.PerspectiveCamera){
			let perspectiveCamera = this.camera as THREE.PerspectiveCamera
			perspectiveCamera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
			perspectiveCamera.updateProjectionMatrix()
		}
	}

	render(){
		if(this.renderer === null || this.scene === null || this.camera === null){
			throw new Error("cannot render")
		}
		this.renderer.render(this.scene, this.camera)
	}

	cleanup(){
		this.camera = null
		this.renderer.dispose()
		this.renderer = null
		this.scene = null
	}

	private canvas:HTMLCanvasElement = null
	private renderer:THREE.WebGLRenderer = null
	private scene:THREE.Scene = null
	private camera:THREE.Camera = null
}
