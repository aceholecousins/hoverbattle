import * as p2 from "p2"
import {vec2} from "gl-matrix"
import {Shape, ShapeConfig, shapeFactory} from "../shape"
import {RigidBodyConfig, RigidBody, defaultRigidBodyConfig} from "../rigidbody"
import {defaultTo} from "../../utils"

export class P2RigidBody implements RigidBody{
	kind:"rigidbody"
	p2body:p2.Body
	readonly shapes: Shape[]

	constructor(config:RigidBodyConfig){
		this.p2body = new p2.Body()

		this.mass = defaultTo(config.mass, defaultRigidBodyConfig.mass)
		this.position = defaultTo(config.position, defaultRigidBodyConfig.position)
		this.velocity = defaultTo(config.velocity, defaultRigidBodyConfig.velocity)
		this.damping = defaultTo(config.damping, defaultRigidBodyConfig.damping)
		this.angle = defaultTo(config.angle, defaultRigidBodyConfig.angle)
		this.angularVelocity = defaultTo(config.angularVelocity, defaultRigidBodyConfig.angularVelocity)
		this.angularDamping = defaultTo(config.angularDamping, defaultRigidBodyConfig.angularDamping)

		for(let shapeCfg of config.shapes){
			let shape = shapeFactory.createShape(shapeCfg)
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

	applyLocalForce(
		force: vec2,
		localPointOfApplication = vec2.fromValues(0, 0)
	){
		this.p2body.applyForceLocal(
			[force[0], force[1]],
			[localPointOfApplication[0], localPointOfApplication[1]]
		)
	}

	applyImpulse(
		impulse: vec2,
		localPointOfApplication = vec2.fromValues(0, 0)
	){
		this.p2body.applyImpulse(
			[impulse[0], impulse[1]],
			[localPointOfApplication[0], localPointOfApplication[1]]
		)
	}

	applyLocalImpulse(
		impulse: vec2,
		localPointOfApplication = vec2.fromValues(0, 0)
	){
		this.p2body.applyImpulseLocal(
			[impulse[0], impulse[1]],
			[localPointOfApplication[0], localPointOfApplication[1]]
		)
	}

	applyTorque(torque: number){
		this.p2body.angularForce += torque
	}

	applyAngularMomentum(angularMomentum: number){
		this.p2body.angularVelocity += this.p2body.invInertia * angularMomentum
	}

	toBeDeleted = false
}