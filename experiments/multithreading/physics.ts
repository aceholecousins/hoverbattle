
interface Vec2 {
	x: number
	y: number
}

interface Box {
	kind: "box"
	width: number
	height: number
}

interface Circle {
	kind: "circle"
	radius: number
}

type Shape = Box | Circle

interface RigidBody {
	setPosition(position: Vec2): RigidBody
	getPosition(): Vec2
	setVelocity(velocity: Vec2): RigidBody
	getVelocity(): Vec2
	/*	setDamping(damping:number):RigidBody
		getDamping():number
	
		setAngle(angle:number):RigidBody
		getAngle():number
		setAngularVelocity(angularVelocity:number):RigidBody
		getAngularVelocity():number
		setAngularDamping(angularDamping:number):RigidBody
		getAngularDamping():number
	
		setMass(mass:number):RigidBody
		getMass():number
		*/
	setShape(shape: Shape): RigidBody
	/*
	getShape():Shape
	*/
	applyForce(force: Vec2): RigidBody
	/*
	applyImpulse(impulse:Vec2):RigidBody
	applyTorque(torque:number):RigidBody
	applyAngularMomentum(angularMomentum:number):RigidBody
	*/
}

interface Physics {
	createBody(): RigidBody
	step(dt: number): void
}

