
import { Role } from "game/entities/actor"
import { Entity } from "game/entities/entity"
export class CollisionOverride<A, B> {
	/// this will only be consulted if the two roles can interact, it can veto a collision

	readonly roleA: Role<A>
	readonly roleB: Role<B>

	allowCollision: (
		entityA: Entity & A,
		entityB: Entity & B
	) => boolean

	constructor(
		roleA: Role<A>,
		roleB: Role<B>,
		allowCollision: (
			entityA: Entity & A,
			entityB: Entity & B
		) => boolean
	) {
		this.roleA = roleA
		this.roleB = roleB
		this.allowCollision = allowCollision
	}
}

export class CollisionHandler<A, B> {
	/// will be called upon collision of two objects

	readonly roleA: Role<A>
	readonly roleB: Role<B>
	readonly mask: number

	onCollision: (
		entityA: Entity & A,
		entityB: Entity & B
	) => void

	constructor(
		roleA: Role<A>,
		roleB: Role<B>,
		onCollision: (
			entityA: Entity & A,
			entityB: Entity & B
		) => void
	) {
		this.roleA = roleA
		this.roleB = roleB
		this.mask = roleA.bit | roleB.bit
		this.onCollision = onCollision
	}
}