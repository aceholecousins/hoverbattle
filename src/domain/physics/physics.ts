
import {RigidBodyConfig, RigidBody} from "./rigidbody"
import {CollisionOverride, CollisionHandler} from "domain/physics/collision"

export interface Physics{
	addRigidBody(body: RigidBodyConfig): RigidBody
	registerCollisionOverride(override:CollisionOverride<any, any>):void
	registerCollisionHandler(handler:CollisionHandler<any, any>):void
	step(dt:number):void
}
