import {vec2} from "gl-matrix"
import {ShapeConfig, Shape, shapeFactory} from "./shape.js"
import { defaultCircleConfig } from "./circle.js"

export interface RigidBody{
	kind: "rigidbody"

	readonly shapes: Shape[]

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

	toBeDeleted: boolean
}

export interface RigidBodyConfig{
	shapes: ShapeConfig<any>[]
	
	mass?: number

	position?: vec2
	velocity?: vec2
	damping?: number

	angle?: number
	angularVelocity?: number
	angularDamping?: number
}

export let defaultRigidBodyConfig:Required<RigidBodyConfig> = {
	shapes: [defaultCircleConfig],
	mass: 1,
	position: vec2.fromValues(0, 0),
	velocity: vec2.fromValues(0, 0),
	damping: 1,
	angle: 0,
	angularVelocity: 0,
	angularDamping: 1
}