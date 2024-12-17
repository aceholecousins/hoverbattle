import { Physics } from "game/physics/physics"
import { P2Physics } from "adapters/physics/p2/p2physics"
import { PlanckPhysics } from "adapters/physics/planck/planckphysics"

import * as assert from 'assert'
import test from 'node:test';
import { Circle } from "game/physics/shapes";
import { Vector2 } from "math";

import * as ac from 'asciichart'
import { RigidBodyConfig } from "game/physics/rigidbody";
import { RoleSet } from "game/entities/actor";

let makePhysics = () => {
	//return new P2Physics() as Physics
	return new PlanckPhysics() as Physics
}

function assertApprox(actual: number, expected: number, message: string) {
	if (expected > 0) {
		assert.ok(actual > expected * 0.98 - 0.001 && actual < expected * 1.02 + 0.001, message)
	} else {
		assert.ok(actual < expected * 0.98 + 0.001 && actual > expected * 1.02 - 0.001, message)
	}
}

let testBodyConfig = new RigidBodyConfig({
	actor: null,
	shapes: [new Circle(1)],
	static: false,
	mass: 1,
	inertia: 1,
	position: new Vector2(0, 0),
	velocity: new Vector2(0, 0),
	damping: 0,
	angle: 0,
	angularVelocity: 0,
	angularDamping: 0
})

test('initialization', (t) => {

	let physics = makePhysics()

	let testActor = { roles: new RoleSet() }

	let body = physics.addRigidBody(new RigidBodyConfig({
		actor: testActor,
		shapes: [new Circle(1)],
		static: false,
		mass: 2,
		inertia: 3,
		position: new Vector2(4, 5),
		velocity: new Vector2(6, 7),
		damping: 8,
		angle: 0.5,
		angularVelocity: 10,
		angularDamping: 11
	}))

	assert.equal(body.getActor(), testActor, "actor")
	assert.equal(body.getMass(), 2, "mass")
	assert.equal(body.getInertia(), 3, "inertia")
	assert.deepEqual(body.getPosition(), new Vector2(4, 5), "position")
	assert.deepEqual(body.getVelocity(), new Vector2(6, 7), "velocity")
	assert.equal(body.getDamping(), 8, "damping")
	assert.equal(body.getAngle(), 0.5, "angle")
	assert.equal(body.getAngularVelocity(), 10, "angularVelocity")
	assert.equal(body.getAngularDamping(), 11, "angularDamping")
})

test('forces and accelerations', (t) => {

	let physics = makePhysics()

	let body = physics.addRigidBody({
		...testBodyConfig,
		mass: 10,
		inertia: 20
	})

	for (let i = 0; i < 100; i++) {
		body.applyGlobalForce(new Vector2(30, 0))
		body.applyTorque(50)
		physics.step(0.01)
	}

	assertApprox(body.getVelocity().x, 3, "velocity after force applied")
	assertApprox(body.getPosition().x, 1.5, "position after force applied")
	assertApprox(body.getAngularVelocity(), 2.5, "angular velocity after torque applied")
	assertApprox(body.getAngle(), 1.25, "angle after torque applied")

})

test('damping', (t) => {

	let physics = makePhysics()

	let body = physics.addRigidBody({
		...testBodyConfig,
		velocity: new Vector2(10, 0),
		damping: 0.7,
		angularVelocity: 10,
		angularDamping: 0.3
	})

	for (let i = 0; i < 100; i++) {
		physics.step(0.01)
	}

	assertApprox(body.getVelocity().x, Math.exp(-0.7) * 10, "velocity after damping")
	assertApprox(body.getAngularVelocity(), Math.exp(-0.3) * 10, "angular velocity after angular damping")
})

test('off-center global force', (t) => {

	let physics = makePhysics()

	let body = physics.addRigidBody(testBodyConfig)

	for (let i = 0; i < 100; i++) {
		body.applyGlobalForce(new Vector2(1, 0), new Vector2(0, 1))
		physics.step(0.01)
	}

	assertApprox(body.getVelocity().x, 1, "x velocity after off-center force")
	assertApprox(body.getVelocity().y, 0, "y velocity after off-center force")
	assertApprox(body.getAngularVelocity(), -1, "angular velocity after off-center force")
})

test('off-center local force', (t) => {

	let physics = makePhysics()

	let body = physics.addRigidBody(testBodyConfig)

	for (let i = 0; i < 100; i++) {
		body.applyLocalForce(new Vector2(2, 0), new Vector2(0, 3))
		physics.step(0.01)
	}

	// these values were found with a numerical solver in python
	assertApprox(body.getPosition().x, 0.77, "x position after local off-center force")
	assertApprox(body.getPosition().y, -0.37, "y position after local off-center force")
	assertApprox(body.getAngle(), -3, "angular velocity after off-center force")
})

test('impulses', (t) => {

	let physics = makePhysics()

	let body = physics.addRigidBody({
		...testBodyConfig,
		angle: Math.PI,
		mass: 5,
		inertia: 2
	})

	body.applyGlobalImpulse(new Vector2(10, 0), new Vector2(0, 1))
	physics.step(0.001)
	assertApprox(body.getVelocity().x, 2, "x velocity after impulse")
	assertApprox(body.getAngularVelocity(), -5, "angular velocity after impulse")

	body.applyLocalImpulse(new Vector2(10, 0), new Vector2(0, -1)) // circle is 180° rotated
	physics.step(0.001)
	assertApprox(body.getVelocity().x, 0, "x velocity after backwards impulse")
	assertApprox(body.getAngularVelocity(), 0, "angular velocity after backwards impulse")

	body.applyAngularImpulse(10)
	physics.step(0.001)
	assertApprox(body.getAngularVelocity(), 5, "angular velocity after angular impulse")
})