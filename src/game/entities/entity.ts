import { Actor, Role, RoleSet, assignRole, revokeRole } from "./actor"
import { Mesh } from "../graphics/mesh"
import { RigidBody } from "../physics/rigidbody"

export class Entity implements Actor{

	roles:RoleSet
	body:RigidBody
	mesh:Mesh

	private disposed = false

	constructor(){
		this.roles = new RoleSet()
	}

	//exert(influence:Influence)
	update(dt:number){}

	dispose(){
		this.disposed = true
	}

	destroyIfDisposed() {
		if(this.disposed) {
			this.body.destroy()
			this.body = null
			this.mesh.destroy()			
			this.mesh = null
			return true
		} else {
			return false
		}
	}
}
