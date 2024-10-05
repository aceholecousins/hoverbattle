
import { Actor, Role } from "game/entities/actor"

export class CollisionOverride<A, B> {
	/// this will only be consulted if the two roles can interact, it can veto a collision

	readonly roleA: Role<A>
	readonly roleB: Role<B>

	allowCollision: (
		actorA: Actor & A,
		actorB: Actor & B
	) => boolean

	constructor(
		roleA: Role<A>,
		roleB: Role<B>,
		allowCollision: (
			actorA: Actor & A,
			actorB: Actor & B
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
		actorA: Actor & A,
		actorB: Actor & B
	) => void

	constructor(
		roleA: Role<A>,
		roleB: Role<B>,
		onCollision: (
			actorA: Actor & A,
			actorB: Actor & B
		) => void
	) {
		this.roleA = roleA
		this.roleB = roleB
		this.mask = roleA.bit | roleB.bit
		this.onCollision = onCollision
	}
}