
import {bridge} from "worker/worker"
import {Graphics} from "domain/graphics/graphics"
import {createGraphicsClient} from "adapters/graphics/graphicsbridge/graphicsclient"
import {ModelMeshConfig, Mesh} from "domain/graphics/mesh"
import {Checklist} from "./checklist"
import {P2Physics} from "adapters/physics/p2/p2physics"
import {CircleConfig} from "domain/physics/circle"
import {vec2, quat} from "gl-matrix"
import {RigidBody, RigidBodyConfig} from "domain/physics/rigidbody"
import {Controller} from "domain/controller/controller"
import {wrapAngle} from "utilities/math_utils"
import {Physics} from "domain/physics/physics"
import {Model} from "domain/graphics/model"
import {Arena, loadArena} from "arena/arena"
import { ActionCam, ActionCamConfig } from "domain/actioncam"
import { ControllerManager } from "domain/controller/controllermanager"
import { createControllerManagerClient } from "adapters/controller/controllerbridge/controllermanagerclient"

let dt = 1/100

let graphics:Graphics
let physics:Physics = new P2Physics() as Physics
let gliderAsset:Model
let arena:Arena
let actionCam:ActionCam

let checklist = new Checklist({onComplete:start})

let initGraphicsItem = checklist.newItem()
let loadGliderItem = checklist.newItem()
let loadArenaItem = checklist.newItem()

let controllerManager:ControllerManager = createControllerManagerClient("controllerManager")

async function initGraphics(){
	
	// when we are not using a worker, we have to be sure that the graphics server
	// is registered at the bridge dummy before the client requests it
	// so we use a timeout here
	graphics = await createGraphicsClient()
	graphics.control.setSceneOrientation([-Math.SQRT1_2, 0, 0, Math.SQRT1_2])
	initGraphicsItem.check()

	actionCam = new ActionCam(graphics, new ActionCamConfig())
	actionCam.camera.activate()

	gliderAsset = graphics.model.load(
		"glider/glider.gltf",
		loadGliderItem.check
	)

	loadArena(
		"arenas/testarena2/script.js",
		graphics,
		physics,
		function(loaded:Arena){
			arena = loaded
			loadArenaItem.check()
		}
	)

	bridge.sendAll()
}

initGraphics()

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
		this.thrust = this.controller.getThrust() * 20;
		this.body.applyLocalForce(vec2.fromValues(this.thrust, 0))

		const turnRate = this.controller.getTurnRate()
		if(turnRate != undefined) {
			this.body.applyTorque(turnRate * 20)
		}
		const direction = this.controller.getAbsoluteDirection()
		if(direction != undefined) {
			this.turnToDirection(direction)
		}
		
		this.mesh.position = [
			this.body.position[0], this.body.position[1], 0.1]
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


	let gliders:Glider[] = []
	controllerManager.addConnectionListener((controller) => {
		for (let i = 0; i < 10; i++) {
			let glider = new Glider(gliderBodyCfg, gliderModelCfg, controller)
			glider.body.position = vec2.fromValues(Math.random()*20-10, Math.random()*20-10)
			glider.body.angle = Math.random()*1000
			gliders.push(glider)
			actionCam.follow(glider.body, 1.5)
		}
	})

	setInterval(()=>{
		for(let glider of gliders){
			glider.update()
		}
		physics.step(dt)
		actionCam.update(dt)
		bridge.sendAll()
	}, 1000*dt)
}
