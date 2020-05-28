
import {RigidBodyConfig, RigidBody, rigidBodyDefaults} from "../rigidbody"
import {Physics} from "../physics"
import {P2RigidBody} from "./p2rigidbody"
import * as p2 from "p2"

export class P2Physics implements Physics{

	p2world:p2.World
	rigidBodies:P2RigidBody[]

	constructor(){
		this.p2world = new p2.World({gravity:[0, 0]})
	}

	addRigidBody(config: RigidBodyConfig):RigidBody{
		const index = this.rigidBodies.length
		const body = new P2RigidBody(this.p2world, config)
		this.rigidBodies.push(body)
		this.p2world.addBody(body.p2body)
		return body
	}

	step(dt:number){
		this.p2world.step(dt)
	}

}

