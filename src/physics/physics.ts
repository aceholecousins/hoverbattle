import { vec2 } from "gl-matrix";
import {RigidBodyConfig, RigidBody} from "./rigidbody"

export interface Physics{
	addRigidBody(body: RigidBodyConfig): RigidBody
	step(dt:number):void
}
