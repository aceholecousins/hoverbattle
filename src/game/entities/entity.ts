import { Actor, Role, RoleSet, assignRole } from "./actor"
import { Mesh } from "game/graphics/mesh"
import { RigidBody } from "game/physics/rigidbody"
import { broker } from "broker"
import { Physics } from "game/physics/physics"
import { CollisionOverride } from "game/physics/collision"

export let entityRole = new Role<Actor>("entity")

export class Entity implements Actor {

	roles: RoleSet
	body: RigidBody
	mesh: Mesh

	parent: Entity | null = null

	collidesWithParent = true
	collidesWithSibling = true

	private disposeCallbacks: (() => void)[] = []
	private disposed = false

	private updateHandler = (e: any) => this.update(e.dt)
	private purgeHandler = () => this.removeIfDisposed()

	constructor() {
		this.roles = new RoleSet()
		assignRole(this, entityRole)
		broker.update.addHandler(this.updateHandler)
		broker.purge.addHandler(this.purgeHandler)
	}

	protected update(dt: number) { }

	onDispose(callback: () => void) {
		this.disposeCallbacks.push(callback)
	}

	dispose() {
		for (let cb of this.disposeCallbacks) {
			cb()
		}
		this.disposed = true
	}

	isDisposed() {
		return this.disposed
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

export function registerRelatedEntityCollisionOverride(physics: Physics) {

	physics.registerCollisionOverride(new CollisionOverride(
		entityRole, entityRole, function (
			entityA: Entity, entityB: Entity
		) {
		if (
			(!entityA.collidesWithParent
				&& entityA.parent === entityB)
			||
			(!entityB.collidesWithParent
				&& entityB.parent === entityA)
		) {
			return false
		}
		if (
			(!entityA.collidesWithSibling
				|| !entityB.collidesWithSibling)
			&& entityA.parent === entityB.parent
			&& entityA.parent !== null
		) {
			return false
		}
		return true
	}
	))
}