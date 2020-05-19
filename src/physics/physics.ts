import { vec2 } from "gl-matrix";
import {RigidBodyConfig, RigidBody} from "./rigidbody.js"

export interface Physics{

	addRigidBody(body: RigidBodyConfig): RigidBody
	readonly rigidBodies: RigidBody[]
	removeRigidBody(body: RigidBody): void

	step(dt:number):void

}

