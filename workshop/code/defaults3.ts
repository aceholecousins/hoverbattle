
for some reason this stops working when a tsconfig is present
and works again when setting "strictNullChecks": true in it

type Defaults<T> = { [K in keyof T as undefined extends T[K] ? K : never]-?: T[K]; };

interface Config {
    req: number
    opt?: number
}

const configDefaults: Defaults<Config> = {
    opt: 5
}

function frobnicateA(config: Config) {
    let cfg = { ...configDefaults, ...config }
    console.log(cfg.req, cfg.opt)
}

frobnicateA({ req: 1, opt: 2 })




export class Role<I> {
	static numRoles = 0

	bit: number // bit that identifies this role
	mask: number // bitmask storing all roles that this role collides with

	constructor(public readonly tag: string = "unnamed") {
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

class Shape{};
class Vector2{};

export interface RigidBodyConfig {
	actor: Actor

	shapes?: Shape[]

	static?: boolean
	fixedRotation?: boolean

	mass?: number
	inertia?: number

	position?: Vector2
	velocity?: Vector2
	damping?: number

	angle?: number
	angularVelocity?: number
	angularDamping?: number
}

export let rigidBodyDefaults: Defaults<RigidBodyConfig> = {
	shapes: [],
	static: false,
	fixedRotation: false,
	mass: 1,
	inertia: 1,
	position: new Vector2(),
	velocity: new Vector2(),
	damping: 0.1,
	angle: 0,
	angularVelocity: 0,
	angularDamping: 0.1
}


export class RBC {
	actor: number

	shapes?: Shape[]

	static?: boolean
	fixedRotation?: boolean

	mass?: number
	inertia?: number

	position?: Vector2
	velocity?: Vector2
	damping?: number

	angle?: number
	angularVelocity?: number
	angularDamping?: number

	constructor(){}
}