
import {ThreeGraphics} from "adapters/graphics/threegraphics/threegraphics"
import {ModelConfig, Model} from "domain/graphics/model"
import {Checklist} from "./checklist"
import { P2Physics } from "adapters/physics/p2/p2physics"
import { CircleConfig } from "domain/physics/circle"
import { vec2, quat } from "gl-matrix"
import { RigidBody, RigidBodyConfig } from "domain/physics/rigidbody"
import { Controller } from "domain/controller/controller"
import { Keyboard } from "adapters/controller/keyboard"

let graphics = new ThreeGraphics(document.getElementById("rendertarget") as HTMLCanvasElement)
let physics = new P2Physics()

class Glider{
	body:RigidBody
	model:Model
	controller:Controller

	thrust:number = 0
	angularMomentum:number = 0

	constructor(bodyCfg:RigidBodyConfig, modelCfg:ModelConfig, controller:Controller){
		this.body = physics.addRigidBody(bodyCfg)
		// TODO: the return type of the object factory
		// does not pass through additional properties like color
		// (I think it does but TypeScript doesn't know)
		// Maybe the "kind" must carry these parameters
		this.model = graphics.addObject(modelCfg) as Model
		this.controller = controller
	}

	update(){
		this.thrust = this.controller.getThrust() * 10;
		this.body.applyLocalForce(vec2.fromValues(this.thrust, 0))

		this.angularMomentum = this.controller.getTurnRate() * 0.3;
		if(this.angularMomentum != undefined) {
			this.body.applyAngularMomentum(this.angularMomentum)
		}
		
		this.model.position = [
			this.body.position[0], this.body.position[1], 0]
		this.model.orientation = quat.fromEuler(
			[0,0,0,0], 0, 0, this.body.angle /Math.PI * 180)
	}
}

function start(){

	const gliderBodyCfg = new RigidBodyConfig({
		shapes:[new CircleConfig({radius:1})],
		damping: 0.7,
		angularDamping: 0.99
	})

	const gliderModelCfg:ModelConfig = {
		kind:"model",
		asset:gliderAsset,
		color:{r:1, g:1, b:1}
	}
	
	const controller = new Keyboard
	let gliders:Glider[] = []
	for(let i=0; i<50; i++){
		let glider = new Glider(gliderBodyCfg, gliderModelCfg, controller)
		glider.body.position = vec2.fromValues(Math.random()*20-10, Math.random()*20-10)
		glider.body.angle = Math.random()*1000
		gliders.push(glider)
	}

	function animate(time:number){
		requestAnimationFrame(animate)

		for(let glider of gliders){
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
