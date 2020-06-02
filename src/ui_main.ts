
import {ThreeGraphics} from "./graphics/threegraphics/threegraphics"
import {ModelConfig, Model} from "./graphics/model"
import {Checklist} from "./checklist"
import { P2Physics } from "./physics/p2/p2physics"
import { CircleConfig } from "./physics/circle"
import { vec2, quat } from "gl-matrix"
import { RigidBody, RigidBodyConfig } from "./physics/rigidbody"

let graphics = new ThreeGraphics(document.getElementById("rendertarget") as HTMLCanvasElement)
let physics = new P2Physics()

class Glider{
	body:RigidBody
	model:Model
	constructor(bodyCfg:RigidBodyConfig, modelCfg:ModelConfig){
		this.body = physics.addRigidBody(bodyCfg)
		// TODO: the return type of the object factory
		// does not pass through additional properties like color
		// (I think it does but TypeScript doesn't know)
		// Maybe the "kind" must carry these parameters
		this.model = graphics.addObject(modelCfg) as Model
	}

	update(){
		this.model.position = [
			this.body.position[0], this.body.position[1], 0]
		this.model.orientation = quat.fromEuler(
			[0,0,0,0], 0, 0, this.body.angle /Math.PI * 180)
	}
}

function start(){

	const gliderBodyCfg = {
		shapes:[{
			kind:"circle",
			radius:1
		} as CircleConfig],
		damping: 0.7,
		angularDamping: 0.99
	}

	const gliderModelCfg:ModelConfig = {
		kind:"model",
		asset:gliderAsset,
		color:{r:1, g:1, b:1}
	}

	let gliders:Glider[] = []
	for(let i=0; i<50; i++){
		let glider = new Glider(gliderBodyCfg, gliderModelCfg)
		glider.body.position = vec2.fromValues(Math.random()*20-10, Math.random()*20-10)
		glider.body.angle = Math.random()*1000
		gliders.push(glider)
	}

	let thrust = 0
	let spinLeft = 0
	let spinRight = 0

	function onKeyAction(key:string, down:boolean){
		if(key == "KeyW"){thrust = down? 1:0}
		if(key == "KeyA"){spinLeft = down? 1:0}
		if(key == "KeyD"){spinRight = down? 1:0}
	}
	document.addEventListener('keydown', function(evt:KeyboardEvent){
		onKeyAction(evt.code, true)
	})
	document.addEventListener('keyup', function(evt:KeyboardEvent){
		onKeyAction(evt.code, false)
	})

	function animate(time:number){
		requestAnimationFrame(animate)

		for(let glider of gliders){
			glider.body.applyLocalForce(vec2.fromValues(thrust*10, 0))
			glider.body.applyAngularMomentum((spinLeft-spinRight)*0.3)
			glider.update()
		}

		physics.step(1/60)

		graphics.update(time)
	}
	requestAnimationFrame(animate)
	
}


let checklist = new Checklist({onComplete:start})

let loadGlider = checklist.newItem()
const gliderAsset = graphics.loadAsset<"model">(
	{kind:"model", file:"glider/glider.gltf"},
	loadGlider.check
)
