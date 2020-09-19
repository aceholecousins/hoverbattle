
import {Graphics} from "domain/graphics/graphics"
import {graphicsClient} from "adapters/graphics/graphicsbridge/graphicsclient"
import {ModelMeshConfig, Mesh} from "domain/graphics/mesh"
import {Checklist} from "./checklist"
import { P2Physics } from "adapters/physics/p2/p2physics"
import { CircleConfig } from "domain/physics/circle"
import { vec2, quat } from "gl-matrix"
import { RigidBody, RigidBodyConfig } from "domain/physics/rigidbody"
import { Controller } from "domain/controller/controller"
import { wrapAngle } from "utilities/math_utils"
import { bridge } from "worker/worker"
import { Physics } from "domain/physics/physics"

let dt = 1/100

let graphics = graphicsClient as Graphics
let physics = new P2Physics() as Physics

let checklist = new Checklist({onComplete:start})

let loadGlider = checklist.newItem()
const gliderAsset = graphics.model.load(
	"glider/glider.gltf",
	loadGlider.check
)
bridge.sendAll()

class Glider{
	body:RigidBody
	mesh:Mesh
	controller:Controller

	thrust:number = 0

	constructor(bodyCfg:RigidBodyConfig, modelCfg:ModelMeshConfig, controller:Controller){
		this.body = physics.addRigidBody(bodyCfg)
		this.mesh = graphics.mesh.createFromModel(modelCfg)
		this.controller = controller
	}

	update(){
		this.thrust = this.controller.getThrust() * 10;
		this.body.applyLocalForce(vec2.fromValues(this.thrust, 0))

		const turnRate = this.controller.getTurnRate()
		if(turnRate != undefined) {
			this.body.applyAngularMomentum(turnRate * 0.1)
		}
		const direction = this.controller.getAbsoluteDirection()
		if(direction != undefined) {
			this.turnToDirection(direction)
		}
		
		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0]
		this.mesh.orientation = quat.fromEuler(
			[0,0,0,0], 0, 0, this.body.angle /Math.PI * 180)
	}
	turnToDirection(direction: number) {
		let wrappedAngle = wrapAngle(this.body.angle);		
		let directionDiff = wrapAngle(wrappedAngle - direction);
		let threshold = 0.0001;
		if(Math.abs(directionDiff) > threshold) {
			let sign = Math.sign(directionDiff)
			this.body.applyAngularMomentum(-sign * 0.3)
		}
	}
}

function start(){
	const gliderBodyCfg = new RigidBodyConfig({
		shapes:[new CircleConfig({radius:1})],
		damping: 0.7,
		angularDamping: 0.99
	})

	const gliderModelCfg:ModelMeshConfig = new ModelMeshConfig({
		asset:gliderAsset
	})

	const controller:Controller = {
		getAbsoluteDirection(){return undefined},
		getThrust(){return 1},
		getTurnRate(){return 1},
		isShooting(){return false},
		setPauseCallback(fn){}
	}
	let gliders:Glider[] = []
	for(let i=0; i<50; i++){
		let glider = new Glider(gliderBodyCfg, gliderModelCfg, controller)
		glider.body.position = vec2.fromValues(Math.random()*20-10, Math.random()*20-10)
		glider.body.angle = Math.random()*1000
		gliders.push(glider)
	}

	setInterval(()=>{
		for(let glider of gliders){
			glider.update()
		}
		physics.step(dt)
		bridge.sendAll()
	}, 1000*dt)
}
