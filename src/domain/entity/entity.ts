import { Actor, Role, RoleSet, assignRole, revokeRole } from "./actor"
import { Mesh } from "../graphics/mesh"
import { RigidBody } from "../physics/rigidbody"

export class Entity implements Actor{

	roles:RoleSet
	body:RigidBody
	mesh:Mesh

	constructor(){
		this.roles = new RoleSet()
	}

	//exert(influence:Influence)
	update(){}
}
