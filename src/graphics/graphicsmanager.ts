import { WebGLRenderer, Scene, PerspectiveCamera, Color, Texture, Camera, Object3D } from "three"


export class GraphicsManager{

	constructor(canvasId:string){
		this.canvas = <HTMLCanvasElement>document.getElementById(canvasId)
		window.addEventListener('resize', this.resize.bind(this))
	}

	setup(){
		this.renderer = new WebGLRenderer({canvas:this.canvas})
		this.scene = new Scene()
		this.camera = new PerspectiveCamera(75, 1.0, 0.1, 100)
		this.camera.position.set(0, 0, 10)
		this.scene.add(this.camera)
		this.resize()
	}

	setBackground(background:Color|Texture){
		this.scene.background = background
	}

	setCamera(camera:Camera){
		this.camera = camera
		this.resize()
	}

	addToScene(object:Object3D){
		this.scene.add(object)
	}

	removeFromScene(object:Object3D){
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
		if(this.camera !== null && this.camera instanceof PerspectiveCamera){
			let perspectiveCamera = this.camera as PerspectiveCamera
			perspectiveCamera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
			perspectiveCamera.updateProjectionMatrix()
		}
	}

	cleanup(){
		this.camera = null
		this.renderer.dispose()
		this.renderer = null
		this.scene = null
	}


	private canvas:HTMLCanvasElement = null
	private renderer:WebGLRenderer = null
	private scene:Scene = null
	private camera:Camera = null
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
