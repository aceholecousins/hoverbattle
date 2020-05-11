
// P2 handles collision filtering like this:
// Each body can have several shapes, each shape can have its individual
// collision group and collision mask (both 32bit bitmasks).
// Two shapes A and B can collide if
// (A.group & B.mask)!=0 && (B.group & A.mask)!=0)
// otherwise they pass through each other.
// See here for intended usage:
// http://schteppe.github.io/p2.js/docs/classes/Shape.html#property_collisionGroup

// We will use it like this:
// Each entity can have several roles. A role is associated with a certain
// interface and a collision group (defined by the bit in the role).
// Each entity has exactly one body and each body can have multiple shapes,
// all shapes have the same collision group being composed by oring all
// role bits of the entity together (stored in roles.bitmask)

// you can copypaste all of this to https://www.typescriptlang.org/play

let P2PhysicsEngine:any

// I is only used to associate an interface with this role
// for type safety, it is not actually used in the role
class Role<I>{
	static numRoles = 0
	index:number
	bit:number
	constructor()
	{
		this.index = Role.numRoles
		this.bit = 1 << (Role.numRoles)
		Role.numRoles += 1
	}
}

class RoleSet{
	bitmask:number = 0
	list:Role<any>[] = []
}

// this function assignes a role to an entity
// and ensures that the entity implements
// the interface associated with that role
function assignRole<I>(entity:Entity & I, role:Role<I>){
	entity.roles.list[role.index] = role
	entity.roles.bitmask |= role.bit
}

// when a collision callback is assigned to a handler,
// the handler defines IA and IB in order to make sure
// that the entities in the parameters implement these
// interfaces
type CollisionCallback<IA, IB> =
	(entityA: Entity & IA, entityB: Entity & IB) => void

// this map stores handlers for collisions between entities
// of different (or the same) roles,
// indexed by roleA.bit | roleB.bit
interface HandlerMap{
	[oredBits:number]:CollisionCallback<any, any>
}

let collisionManager = {
	handlers:{} as HandlerMap,

	// generics ensure type safety:
	// roleA is associated with the interface IA
	// roleB is associated with the interface IB
	// the callback must be implemented for entities
	// that implement IA and IB
	registerHandler:function<IA, IB>(
		roleA:Role<IA>,
		roleB:Role<IB>,
		callback:CollisionCallback<IA, IB>
	){
		P2PhysicsEngine.makeSureThatEveryShapeWithGroupBitASetHasTheMaskBitOfGroupBSetAndViceVersa()
		this.handlers[roleA.bit | roleB.bit] = callback
	}
}

P2PhysicsEngine.world.on(
	"beginContact",
	function(evt:any){
		let entityA = P2PhysicsEngine.entityMap[evt.bodyA.id]
		let entityB = P2PhysicsEngine.entityMap[evt.bodyB.id]

		// iterate through all the roles of the entities
		// that just collided and call the associated
		// collision handlers if defined
		for(let roleA of entityA.roles.list){
			for(let roleB of entityB.roles.list){
				let handler = collisionManager.handlers[roleA.bit | roleB.bit]
				if(handler !== undefined){
					// some implicit casting happens here without a warning!!
					handler(entityA, entityB)
				}
			}
		}
	}
)

interface Entity{
	roles:RoleSet
	//body:PhysicsBody
	//model:GraphicsModel
	//exert(influence:Influence)
	//update():void
}

/////////////////////////
// level-specific code //
/////////////////////////

// define roles with their interfaces:

interface Destructible{
	hitpoints:number
}
let destructible = new Role<Destructible>()

interface Damaging{
	damage:number
}
let damaging = new Role<Damaging>()

interface Powerup{
	oncollect():void
}
let powerup = new Role<Powerup>()

// register event handlers for collisions
// between entities with roles:

collisionManager.registerHandler(
	destructible,
	damaging,
	function(ea, eb){
		ea.hitpoints -= eb.damage
	}
)

// define entities:

class Glider implements Entity, Destructible{
	roles = new RoleSet()
	hitpoints = 10
	anotherGliderProperty = "ass-kicking"
	constructor(){
		assignRole(this, destructible)
	}
}

// we can (and should) list that Phaser also implements Damaging
// but we don't have to as long as all fields of the interface
// are there which is checked by assignRole
class Phaser implements Entity{
	roles = new RoleSet()
	damage = 1
	constructor(){
		assignRole(this, damaging)
	}
}

class MineCrate implements Entity{
	roles = new RoleSet()
	oncollect(){}
	constructor(){
		assignRole(this, powerup)
		assignRole(this, destructible) // uh oh, MineCrate doesn't have hitpoints
	}
}

