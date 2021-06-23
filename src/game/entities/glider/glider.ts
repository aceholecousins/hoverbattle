import { broker } from "broker"
import { Controller } from "game/controller/controller"
import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/model"
import { Engine } from "game/match"
import { CircleConfig } from "game/physics/circle"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Player } from "game/player"
import { Sound } from "game/sound/soundfx"
import { vec2, quat, vec3 } from "gl-matrix"
import { wrapAngle } from "utilities/math_utils"
import { Entity } from "../entity"

var GLIDER_RADIUS = 1;

export type ShootCallback = () => void

export class Glider extends Entity{
	
	
	shootCallback:ShootCallback

	constructor(
		engine:Engine,
		bodyCfg:RigidBodyConfig,
		modelCfg:ModelMeshConfig,
		public player:Player,
		private thrustSoundController:ThrustSoundController
	){
		super()
		bodyCfg.actor = this
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.mesh = engine.graphics.mesh.createFromModel(modelCfg)
		this.mesh.scaling = vec3.fromValues(GLIDER_RADIUS, GLIDER_RADIUS, GLIDER_RADIUS)
	}

	update(dt:number){
		let thrust = this.player.controller.getThrust();
		this.body.applyLocalForce(vec2.fromValues(thrust * 20, 0))
		this.thrustSoundController.addThrust(thrust)

		const turnRate = this.player.controller.getTurnRate()
		if(turnRate != undefined) {
			this.body.applyTorque(turnRate * 20)
		}
		const direction = this.player.controller.getAbsoluteDirection()
		if(direction != undefined) {
			this.turnToDirection(direction)
		}

		if(this.player.controller.isShooting()) {
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

class ThrustSoundController {

	private thrustSquareSum:number = 0
	private playing = false

	constructor(private sound:Sound) {
		broker.update.addHandler(() => this.update())
	}

	addThrust(thrust:number) {
		this.thrustSquareSum += thrust * thrust
	}

	update() {
		let volume = Math.sqrt(this.thrustSquareSum) * 0.3
		if(volume > 0 && !this.playing) {
			this.sound.play(0.0, 1.0, true)
		}
		this.sound.changeVolume(volume)
		this.thrustSquareSum = 0;
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

	let thrustSoundController = new ThrustSoundController(
		engine.soundFxPlayer.loadSound("game/entities/glider/thrust.ogg"))

	return function(player:Player){
		return new Glider(
			engine,
			gliderBodyCfg,
			gliderModelCfg,
			player,
			thrustSoundController
		) 
	}
}
