import { Mesh } from "../graphics/mesh"
import { broker } from "broker"

export class Visual {

	mesh: Mesh

	private updateHandler = (e: any) => this.update(e.dt)

	constructor() {
		broker.update.addHandler(this.updateHandler)
	}

	protected update(dt: number) { }

	dispose() {
		broker.update.removeHandler(this.updateHandler)
		this.mesh.destroy()
		this.mesh = null
	}
}
