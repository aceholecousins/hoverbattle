
// this is a concept for a wrapper for physics engines
// so they can be exchanged by just changing a single line of code

// all physics engines must implement:

interface ShapeInterface{
    mass:number
}

interface CircleInterface extends ShapeInterface{
    radius:number
}
interface SquareInterface extends ShapeInterface{
    side:number
}

interface RigidBodyInterface<S extends ShapeInterface>{
    shape:S
}

// method A: implement this interface:
interface PhysicsInterface<S extends ShapeInterface>{
    Circle: new () => CircleInterface
    Square: new () => SquareInterface
    RigidBody: new (shapeClass: new () => S) => RigidBodyInterface<S>
}

// method B: use this engine composer that infers types:
let composePhysicsEngineClass = function<
    ENGINESHAPE extends ShapeInterface,
    ENGINECIRCLE extends CircleInterface,
    ENGINESQUARE extends SquareInterface,
    ENGINESHAPEKIND extends ENGINESHAPE,
    ENGINERBODY extends RigidBodyInterface<ENGINESHAPEKIND>
>(
    ShapeClass: new() => ENGINESHAPE,
    CircleClass: new() => ENGINECIRCLE,
    SquareClass: new () => ENGINESQUARE,
    RigidBodyInterface: new(sc:new() => ENGINESHAPEKIND) => ENGINERBODY
){
    return class {
        Circle = CircleClass
        Square = SquareClass
        RigidBody = RigidBodyInterface
    }
}

// implementation for a specific physics engine (here p2):

class P2Shape implements ShapeInterface{
    mass = 1
    p2SpecificShapeStuff = 44
}

class P2Circle extends P2Shape implements CircleInterface{
    radius = 1
    p2SpecificCircleStuff = 21
}

class P2Square extends P2Shape implements SquareInterface{
    side = 2
    p2SpecificSquareStuff = 12
}

class P2RigidBody<S extends P2Shape> implements RigidBodyInterface<S>{
    shape: S
    p2SpecificBodyStuff = 37
    constructor(ShapeClass: new() => S){
        this.shape = new ShapeClass()
    }
}

class P2PhysicsA implements PhysicsInterface<P2Shape>{
    Circle = P2Circle
    Square = P2Square
    RigidBody = P2RigidBody
    p2SpecificEngineStuff = 133
}

let P2PhysicsB = composePhysicsEngineClass(
    P2Shape, P2Circle, P2Square, P2RigidBody
)

// usage

// the only place where the actually wrapped engine is allowed to be mentioned
let myPhysicsA = new P2PhysicsA()

// everything else is engine-independent
let myCircleBodyA = new myPhysicsA.RigidBody(myPhysicsA.Circle)
myCircleBodyA.shape.radius = 3


// testing the factoried engine
let myPhysicsB = new P2PhysicsB()

let mySquareBodyB = new myPhysicsB.RigidBody(myPhysicsB.Square)
mySquareBodyB.shape.side = 5

