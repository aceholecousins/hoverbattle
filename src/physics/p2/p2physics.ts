import { vec2 } from "gl-matrix";
import {ShapeBase} from "../shapes.js"
import {RigidBodyConfig, RigidBody} from "../rigidbody.js"
import {Physics} from "../physics.js"
import {P2Shape, P2Circle, P2Rectangle} from "./p2shapes.js"
import {P2RigidBody} from "./p2rigidbody.js"
import * as p2 from "p2"

export class P2Physics implements Physics{

	p2world:p2.World
	rigidBodies:P2RigidBody[]

	constructor(){
		this.p2world = new p2.World({gravity:[0, 0]})
	}

	addRigidBody(bodyCfg: RigidBodyConfig):RigidBody{
		let body = new P2RigidBody(bodyCfg)
		this.p2world.addBody(body.p2body)
		return body
	}
	removeRigidBody(body: P2RigidBody){
		this.rigidBodies = this.rigidBodies.filter(rb => rb !== body)
		this.p2world.removeBody(body.p2body)
	}

	step(dt:number){
		this.p2world.step(dt)
	}

}

