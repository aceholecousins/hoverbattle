import { Controller } from "game/controller/controller"
import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/model"
import { Engine } from "game/match"
import { CircleConfig } from "game/physics/circle"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { vec2, quat, vec3 } from "gl-matrix"
import { wrapAngle } from "utilities/math_utils"
import { Constructor } from "utils"
import { Entity } from "../entity"

export type ShootCallback = () => void

export class Glider extends Entity{
	team:number = 0
	controller:Controller
	shootCallback:ShootCallback

	constructor(
		engine:Engine,
		bodyCfg:RigidBodyConfig,
		modelCfg:ModelMeshConfig,
		controller:Controller,
		team:number
	){
		super()
		bodyCfg.actor = this
		this.team = team
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.mesh = engine.graphics.mesh.createFromModel(modelCfg)
		this.controller = controller
		//this.mesh.scaling = vec3.fromValues(3, 3, 3)
	}

	update(dt:number){
		let thrust = this.controller.getThrust() * 20;
		this.body.applyLocalForce(vec2.fromValues(thrust, 0))

		const turnRate = this.controller.getTurnRate()
		if(turnRate != undefined) {
			this.body.applyTorque(turnRate * 20)
		}
		const direction = this.controller.getAbsoluteDirection()
		if(direction != undefined) {
			this.turnToDirection(direction)
		}

		if(this.controller.isShooting()) {
			this.shootCallback()			
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


export async function createGliderFactory(engine:Engine){

	let gliderAsset:Model
	
	await new Promise((resolve, reject)=>{
		gliderAsset = engine.graphics.model.load(
			"game/entities/glider/glider6.glb", resolve, reject)
	})

	const gliderBodyCfg = new RigidBodyConfig({
		actor:null, // will be filled by the constructed glider
		shapes:[new CircleConfig({radius:1})],
		damping: 0.7,
		angularDamping: 0.99
	})

	const gliderModelCfg:ModelMeshConfig = new ModelMeshConfig({
		asset:gliderAsset
	})

	return function(team:number, controller:Controller){
		return new Glider(
			engine,
			gliderBodyCfg,
			gliderModelCfg,
			controller,
			team
		) 
	}
}
