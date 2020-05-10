import {vec2} from "gl-matrix"
import {Shape} from "./shapes.js"

export interface RigidBody{

	setPosition(position:vec2):void
	getPosition():vec2
	setVelocity(velocity:vec2):void
	getVelocity():vec2
	/*setDamping(damping:number)
	getDamping():number

	setAngle(angle:number)
	getAngle():number
	setAngularVelocity(angularVelocity:number)
	getAngularVelocity():number
	setAngularDamping(angularDamping:number)
	getAngularDamping():number
	*/
	setMass(mass:number):void
	getMass():number

	addShape(shape:Shape):void
	getShapes():Shape[]
	removeShape(shape:Shape):void

	applyForce(force:vec2, localPointOfApplication?:vec2):void
	//applyImpulse(impulse:vec2, localPointOfApplication?:vec2):void
	applyTorque(torque:number)
	//applyAngularMomentum(angularMomentum:number)
}