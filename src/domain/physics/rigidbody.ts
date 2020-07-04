import {vec2} from "gl-matrix"
import {ShapeConfig, Shape} from "./shape"

export interface RigidBody{
	kind: "rigidbody"

	//readonly shapes: Shape<any>[]

	mass: number

	position: vec2
	velocity: vec2
	damping: number

	angle: number
	angularVelocity: number
	angularDamping: number

	applyForce(force:vec2, localPointOfApplication?:vec2):void
	applyLocalForce(force:vec2, localPointOfApplication?:vec2):void
	applyImpulse(impulse:vec2, localPointOfApplication?:vec2):void
	applyLocalImpulse(impulse:vec2, localPointOfApplication?:vec2):void
	applyTorque(torque:number):void
	applyAngularMomentum(angularMomentum:number):void

	remove():void
}

export class RigidBodyConfig{
	shapes: ShapeConfig<any>[]
	
	mass = 1

	position = vec2.fromValues(0, 0)
	velocity = vec2.fromValues(0, 0)
	damping = 0.1

	angle = 0
	angularVelocity = 0
	angularDamping = 0.1

	constructor(config:Partial<RigidBodyConfig>){
		if("shapes" in config){this.shapes = config.shapes}
		if("mass" in config){this.mass = config.mass}
		if("position" in config){this.position = config.position}
		if("velocity" in config){this.velocity = config.velocity}
		if("damping" in config){this.damping = config.damping}
		if("angle" in config){this.angle = config.angle}
		if("angularVelocity" in config){this.angularVelocity = config.angularVelocity}
		if("angularDamping" in config){this.angularDamping = config.angularDamping}
	}
}