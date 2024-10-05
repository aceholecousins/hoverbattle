
// I is only used to associate an interface with a role
// for type safety, it is not actually used in the role

export class Role<I> {
	static numRoles = 0

	bit: number // bit that identifies this role
	mask: number // bitmask storing all roles that this role collides with

	constructor() {
		this.bit = 1 << (Role.numRoles)
		this.mask = 0
		Role.numRoles += 1
	}
}

export class RoleSet {
	bits: number = 0
	mask: number = 0
	set: Set<Role<any>> = new Set()
}

export interface Actor {
	roles: RoleSet
}

export function assignRole<I>(actor: Actor & I, role: Role<I>) {
	Object.freeze(role) // role must not be changed after this
	if ((actor.roles.bits & role.bit) == 0) {
		actor.roles.set.add(role)
		actor.roles.bits |= role.bit
		actor.roles.mask |= role.mask
	}
}

export function revokeRole<I>(actor: Actor & I, role: Role<I>) {
	if ((actor.roles.bits & role.bit) == 1) {
		actor.roles.set.delete(role)
		actor.roles.bits &= (0xFFFFFFFF ^ role.bit)
		actor.roles.mask = 0
		for (let role of actor.roles.set) {
			this.mask |= role.mask
		}
	}
}

export function interact(roleA: Role<any>, roleB: Role<any>) {
	if (Object.isFrozen(roleA) || Object.isFrozen(roleB)) {
		throw new Error('roles can not be changed after being assigned to actors')
	}
	roleA.mask |= roleB.bit
	roleB.mask |= roleA.bit
}

