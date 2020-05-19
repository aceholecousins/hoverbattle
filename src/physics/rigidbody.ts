import {vec2} from "gl-matrix"
import {ShapeConfig, ShapeBase} from "./shapes.js"

export interface RigidBodyConfig{
	shapes: ShapeConfig[]

	mass?: number

	position?: vec2
	velocity?: vec2
	damping?: number

	angle?: number
	angularVelocity?: number
	angularDamping?: number
}

export interface RigidBody extends Required<Omit<RigidBodyConfig, "shapes">>{
	kind:"rigidbody"
	readonly shapes: ShapeBase[]
	
	applyForce(force:vec2, localPointOfApplication?:vec2):void
	//applyImpulse(impulse:vec2, localPointOfApplication?:vec2):void
	//applyTorque(torque:number):void
	//applyAngularMomentum(angularMomentum:number):void

	toBeDeleted: boolean
}