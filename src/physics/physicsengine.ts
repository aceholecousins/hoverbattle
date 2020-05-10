import { vec2 } from "gl-matrix";
import {RigidBody} from "./rigidbody.js"
import {Shape} from "./shapes.js"

export interface PhysicsEngine{

	// turn engine-independent objects into engine-specific objects
	wrapBody(RigidBody):RigidBody
	wrapShape(Shape):Shape

	addBody(body:RigidBody):void
	getBodies():RigidBody[]
	removeBody(body:RigidBody):void

	step(dt:number):void
}

