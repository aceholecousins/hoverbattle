
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
import {triangle3to2, wrapAngle} from "utilities/math_utils"
import {Physics} from "domain/physics/physics"
import {Model} from "domain/graphics/model"
//import {Arena, loadArena} from "arena/arena"
//import {Arena} from "domain/graphics/arena"
import { ActionCam, ActionCamConfig } from "domain/actioncam"

import { TriangleConfig } from "domain/physics/triangle"
import { createControllerClient } from "adapters/controller/controllerbridge/controllerclient"
import { Entity } from "domain/entity/entity"
import { Actor, Role, assignRole, revokeRole, interact } from "domain/entity/actor"
import { NumberKeyframeTrack } from "three"
import { CollisionHandler, CollisionOverride } from "domain/physics/collision"


import { ControllerManager } from "domain/controller/controllermanager"
import { createControllerManagerClient } from "adapters/controller/controllerbridge/controllermanagerclient"


let dt = 1/100

let graphics:Graphics
let physics:Physics = new P2Physics() as Physics
let gliderAsset:Model
let actionCam:ActionCam

let checklist = new Checklist({onComplete:start})

let initGraphicsItem = checklist.newItem()
let loadGliderItem = checklist.newItem()
let loadArenaItem = checklist.newItem()

let controllerManager = createControllerManagerClient("controllerManager")


interface ArenaProperties{}
let arenaRole = new Role<ArenaProperties>()
let arenaActor = new Entity()

interface GliderProperties{team:number}
let gliderRole = new Role<GliderProperties>()

interact(arenaRole, gliderRole)
interact(gliderRole, gliderRole)

physics.registerCollisionOverride(new CollisionOverride(
	gliderRole, gliderRole, function(
		gliderA:Glider, gliderB:Glider
	){
		return !(gliderA.team == 1 && gliderB.team == 1)
	}
))

physics.registerCollisionHandler(new CollisionHandler(
	gliderRole, gliderRole, function(
		gliderA:Glider, gliderB:Glider
	){
		if(gliderA.team != gliderB.team){
			let a2b = vec2.subtract(
				vec2.create(),
				gliderB.body.position,
				gliderA.body.position
			)
			gliderA.body.applyImpulse(vec2.scale(vec2.create(), a2b, -10))
			gliderB.body.applyImpulse(vec2.scale(vec2.create(), a2b, 10))
		}
	}
))

assignRole(arenaActor, arenaRole)

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

	let arenaAsset = graphics.model.load(
		"arenas/testarena2/testarena2.glb",
		function(meta){
			for(let tri of meta.collision){
				physics.addRigidBody(
					{
						actor:arenaActor,
						mass:Infinity,

						position:[0, 0],
						velocity:[0, 0],
						damping:0,
					
						angle:0,
						angularVelocity:0,
						angularDamping:0,

						shapes:[new TriangleConfig({corners:triangle3to2(tri)})]
					}
				)
			}
			loadArenaItem.check()
			
			graphics.mesh.createFromModel(new ModelMeshConfig({
				asset:arenaAsset
			}))
		}
	)

	let env = graphics.skybox.load(
		"arenas/testarena2/environment/*.jpg",
		function(){
			graphics.control.setEnvironment(env)
		}
	)

	bridge.sendAll()
}

initGraphics()

class Glider extends Entity implements GliderProperties{
	team:number = 0

	controller:Controller

	thrust:number = 0

	constructor(bodyCfg:RigidBodyConfig, modelCfg:ModelMeshConfig, controller:Controller, team:number){
		super()
		bodyCfg.actor = this
		this.team = team
		this.body = physics.addRigidBody(bodyCfg)
		this.mesh = graphics.mesh.createFromModel(modelCfg)
		this.controller = controller
		assignRole(this, gliderRole)
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
		actor:null, // will be filled by the constructed glider
		shapes:[new CircleConfig({radius:1})],
		damping: 0.7,
		angularDamping: 0.99
	})

	const gliderModelCfg:ModelMeshConfig = new ModelMeshConfig({
		asset:gliderAsset
	})

	let gliders:Glider[] = []
	controllerManager.addConnectionCallback((controller) => {
		for(let i=0; i<10; i++){
			let team = i<5? 0:1
			let glider = new Glider(gliderBodyCfg, gliderModelCfg, controller, team)
			glider.mesh.baseColor = team==0? {r:1, g:0.5, b:0}:{r:0, g:0.5, b:1}
			glider.mesh.accentColor = team==0? {r:1, g:0.5, b:0}:{r:0, g:0.5, b:1}
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
