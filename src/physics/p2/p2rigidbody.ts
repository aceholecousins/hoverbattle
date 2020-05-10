import * as p2 from "p2"
import {vec2} from "gl-matrix"
import {RigidBody} from "../rigidbody.js"
import {P2Shape} from "./p2shapes.js"

export class P2RigidBody implements RigidBody{
	p2Body:p2.Body

	constructor(){ this.p2Body = new p2.Body() }

	setPosition(position:vec2){
		vec2.copy(this.p2Body.position, position)
	}
	getPosition(){
		return vec2.clone(this.p2Body.position)
	}
	setVelocity(velocity:vec2){
		vec2.copy(this.p2Body.velocity, velocity)
	}
	getVelocity(){
		return vec2.clone(this.p2Body.position)
	}

	setMass(mass:number){
		this.p2Body.mass = mass
	}
	getMass(){
		return this.p2Body.mass
	}

	addShape(shape:P2Shape){

	}
	getShapes(){

	}
	removeShape(shape:P2Shape):void

	applyForce(force:vec2, localPointOfApplication?:vec2):void
	//applyImpulse(impulse:vec2, localPointOfApplication?:vec2):void
	applyTorque(torque:number)

}