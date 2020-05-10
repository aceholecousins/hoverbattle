import { vec2 } from "gl-matrix";
import {Shape} from "../shapes.js"
import {RigidBody} from "../rigidbody.js"
import {P2Shape, P2Circle, P2Rectangle} from "./p2shapes.js"
import {P2RigidBody} from "./p2rigidbody.js"

export class PhysicsEngine{

	wrapBody(body:RigidBody):P2RigidBody{
		return new P2RigidBody()
	}
	wrapShape(shape:Shape):P2Shape{
		switch(shape.kind){
			case "cirlce":{
				return new P2Circle()
			}
			case "rectangle":{
				return new P2Rectangle()
			}
		}
	}

	addBody(P2RigidBody){

	}
	getBodies(){

	}
	removeBody(body:RigidBody){

	}

	step(dt:number){

	}
}

