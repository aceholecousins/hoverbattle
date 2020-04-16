
import * as THREE from 'three'

export class GraphicsManager{

	constructor(canvasId:string){
		this.canvas = <HTMLCanvasElement>document.getElementById(canvasId)
		window.addEventListener('resize', this.resize.bind(this))
	}

	setup(){
		this.renderer = new THREE.WebGLRenderer({canvas:this.canvas})
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 100)
		this.camera.position.set(0, 0, 10)
		this.scene.add(this.camera)
		this.resize()
	}

	//setBackground(background:THREE.Color|THREE.Texture){
	setBackground(background:any){
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

	animate(){
		this.running = true
		this.renderLoop()
	}

	stop(){
		this.running = false
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


	private canvas:HTMLCanvasElement = null
	private renderer:THREE.WebGLRenderer = null
	//private scene:THREE.Scene|null = null
	private scene:any = null
	//private camera:THREE.Camera|null = null
	private camera:any = null
	private running:boolean = false

	private renderLoop(){
		if(this.running){
			if(this.renderer === null || this.scene === null || this.camera === null){
				throw new Error("cannot render")
			}
			requestAnimationFrame(this.renderLoop.bind(this))
			this.renderer.render(this.scene, this.camera)
		}
	}

}
