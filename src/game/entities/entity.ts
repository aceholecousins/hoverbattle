import { Actor, RoleSet } from "./actor"
import { Mesh } from "../graphics/mesh"
import { RigidBody } from "../physics/rigidbody"
import { broker } from "broker"

export class Entity implements Actor {

	roles: RoleSet
	body: RigidBody
	mesh: Mesh
	onDispose = () => { }

	private disposed = false

	private updateHandler = (e: any) => this.update(e.dt)
	private purgeHandler = () => this.removeIfDisposed()

	constructor() {
		this.roles = new RoleSet()
		broker.update.addHandler(this.updateHandler)
		broker.purge.addHandler(this.purgeHandler)
	}

	protected update(dt: number) { }

	dispose() {
		this.onDispose()
		this.disposed = true
	}

	protected removeIfDisposed() {
		if (this.disposed) {
			broker.purge.removeHandler(this.purgeHandler)
			broker.update.removeHandler(this.updateHandler)

			this.body.destroy()
			this.body = null
			this.mesh.destroy()
			this.mesh = null
		}
	}
}
