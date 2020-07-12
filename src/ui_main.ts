
import {ThreeGraphics} from "adapters/graphics/threegraphics/threegraphics"
import {ModelConfig, Mesh} from "domain/graphics/mesh"
import {Checklist} from "./checklist"
import { P2Physics } from "adapters/physics/p2/p2physics"
import { CircleConfig } from "domain/physics/circle"
import { vec2, quat } from "gl-matrix"
import { RigidBody, RigidBodyConfig } from "domain/physics/rigidbody"
import { Controller } from "domain/controller/controller"
import { Keyboard } from "adapters/controller/keyboard"

let graphics = new ThreeGraphics(document.getElementById("rendertarget") as HTMLCanvasElement)
let physics = new P2Physics()

let checklist = new Checklist({onComplete:start})

let loadGlider = checklist.newItem()
const gliderAsset = graphics.asset.loadModel(
	"glider/glider.gltf",
	loadGlider.check
)

class Glider{
	body:RigidBody
	mesh:Mesh
	controller:Controller

	thrust:number = 0
	angularMomentum:number = 0

	constructor(bodyCfg:RigidBodyConfig, modelCfg:ModelConfig, controller:Controller){
		this.body = physics.addRigidBody(bodyCfg)
		this.mesh = graphics.mesh.createFromModel(modelCfg)
		this.controller = controller
	}

	update(){
		this.thrust = this.controller.getThrust() * 10;
		this.body.applyLocalForce(vec2.fromValues(this.thrust, 0))

		this.angularMomentum = this.controller.getTurnRate() * 0.3;
		if(this.angularMomentum != undefined) {
			this.body.applyAngularMomentum(this.angularMomentum)
		}
		
		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0]
		this.mesh.orientation = quat.fromEuler(
			[0,0,0,0], 0, 0, this.body.angle /Math.PI * 180)
	}
}

function start(){

	const gliderBodyCfg = new RigidBodyConfig({
		shapes:[new CircleConfig({radius:1})],
		damping: 0.7,
		angularDamping: 0.99
	})

	const gliderModelCfg:ModelConfig = new ModelConfig({
		asset:gliderAsset
	})
	
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

		graphics.control.update(time)
	}
	requestAnimationFrame(animate)
	
}



