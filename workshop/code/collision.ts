
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
// interface and a collision group (defined by the bit in its role).
// Each entity has exactly one body and each body can have multiple shapes,
// all shapes have the same collision group being composed by oring all
// role bits of the entity together.

// The only problem is that the user has to make sure that the entity
// classes have matching roles and interfaces.

let P2PhysicsEngine:any

// I is used to associate an interface with this role
class Role<I>{
    static numRoles = 0
	bit:number
    constructor()
    {
        this.bit = 1 << (Role.numRoles++)
    }
}

// IA and IB are the role interfaces of the entities
type CollisionCallback<IA, IB> = (entA:Entity&IA, entB:Entity&IB) => void

interface HandlerMap{
    [index:string]:CollisionCallback<any, any>
}

let collisionManager = {
    handlers:{} as HandlerMap,

    // type safety is ensured here: an entity must implement the interface
    // associated with its roles using IA and IB
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

        for(let roleA of entityA.roles){
            for(let roleB of entityB.roles){
                // the casting happens implicitly here somewhere without a warning...
                let handler = collisionManager.handlers[roleA.bit | roleB.bit]
                if(handler !== undefined){
                    handler(entityA, entityB)
                }
            }
        }
    }
)

interface Entity{
    roles:Role<any>[]
	//body:PhysicsBody
	//model:GraphicsModel
	//exert(influence:Influence)
	//update():void
}

/////////////////////////
// level-specific code //
/////////////////////////

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

collisionManager.registerHandler(
	destructible,
	damaging,
	function(ea, eb){
		ea.hitpoints -= eb.damage
	}
)

// user has to make sure that roles array matches the interfaces
// I couldn't come up with a way to enforce this :/
class Glider implements Entity, Destructible{
    roles = [destructible]
    hitpoints = 10
    anotherGliderProperty = "ass-kicking"
}

class Phaser implements Entity, Damaging{
    roles = [damaging]
    damage = 1
}

class MineCrate implements Entity, Powerup, Destructible{
    roles = [powerup, destructible]
    hitpoints = 6
    oncollect(){}
}