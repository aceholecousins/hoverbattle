
import * as THREE from '../libs/three.module.js'

export class GraphicsManager{

	private canvas:HTMLCanvasElement|null = null
	private renderer:any = null
	private scene:any = null
	private camera:any = null

	constructor(canvasId:string){
		this.canvas = <HTMLCanvasElement>document.getElementById(canvasId)
		window.addEventListener('resize', this.resize.bind(this))
	}

	setup(){
		this.renderer = new THREE.WebGLRenderer(this.canvas)
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 100)
		this.resize()
	}

	resize(){
		if(this.renderer !== null){
			this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
		}
		if(this.camera !== null){
			this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
			this.camera.updateProjectionMatrix()
		}
	}

	cleanup(){
		this.camera = null
		this.renderer.dispose()
		this.renderer = null
		this.scene = null
	}

}
