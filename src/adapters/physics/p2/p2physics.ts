
import {RigidBodyConfig, RigidBody} from "domain/physics/rigidbody"
import {Physics} from "domain/physics/physics"
import {P2RigidBody} from "./p2rigidbody"
import * as p2 from "p2"
import "./p2factorylist"

export class P2Physics implements Physics{

	p2world:p2.World

	constructor(){
		this.p2world = new p2.World({gravity:[0, 0]})
	}

	addRigidBody(config: RigidBodyConfig):RigidBody{
		const body = new P2RigidBody(this.p2world, config)
		return body
	}

	step(dt:number){
		this.p2world.step(dt)
	}

}

