import * as p2 from "p2"
import {vec2} from "gl-matrix"
import {ShapeBase} from "../shapes.js"
import {RigidBodyConfig, RigidBody} from "../rigidbody.js"
import {P2Shape, P2Circle, P2Rectangle, createP2Shape} from "./p2shapes.js"


export class P2RigidBody implements RigidBody{
	kind:"rigidbody"
	p2body:p2.Body
	readonly shapes: ShapeBase[]

	constructor(cfg:RigidBodyConfig){
		this.p2body = new p2.Body()

		for(let shapeCfg of cfg.shapes){
			let shape = createP2Shape(shapeCfg)
			this.shapes.push(shape)
			this.p2body.addShape(shape.p2shape)
		}
	}

	set mass(m: number){
		this.p2body.mass = m
	}
	get mass(){
		return this.p2body.mass
	}

	set position(p: vec2){
		vec2.copy(this.p2body.position, p)
	}
	get position(){
		return vec2.clone(this.p2body.position)
	}

	set velocity(v: vec2){
		vec2.copy(this.p2body.velocity, v)
	}
	get velocity(){
		return vec2.clone(this.p2body.velocity)
	}

	set damping(d: number){
		this.p2body.damping = d
	}
	get damping(){
		return this.p2body.damping
	}


	set angle(phi: number){
		this.p2body.angle = phi
	}
	get angle(){
		return this.p2body.angle
	}

	set angularVelocity(omega: number){
		this.p2body.angularVelocity = omega
	}
	get angularVelocity(){
		return this.p2body.angularVelocity
	}

	set angularDamping(d: number){
		this.p2body.angularDamping = d
	}
	get angularDamping(){
		return this.p2body.angularDamping
	}


	applyForce(
		force: vec2,
		localPointOfApplication = vec2.fromValues(0, 0)
	){
		this.p2body.applyForce(
			[force[0], force[1]],
			[localPointOfApplication[0], localPointOfApplication[1]]
		)
	}

	toBeDeleted = false
}