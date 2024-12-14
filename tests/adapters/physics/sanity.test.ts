import { Physics } from "game/physics/physics"
import { P2Physics } from "adapters/physics/p2/p2physics"
import { PlanckPhysics } from "adapters/physics/planck/planckphysics"

import * as assert from 'assert'
import test from 'node:test';
import { Circle } from "game/physics/shapes";
import { Vector2 } from "math";

let makePhysics = () => {
	//return new P2Physics() as Physics
	return new PlanckPhysics() as Physics
}

function assertApprox(actual: number, expected: number, message: string) {
	if (expected > 0) {
		assert.ok(actual > expected * 0.98 && actual < expected * 1.02, message)
	} else {
		assert.ok(actual < expected * 0.98 && actual > expected * 1.02, message)
	}
}

test('initialization', (t) => {

	let physics = makePhysics()

	let body = physics.addRigidBody({
		actor: null,
		shapes: [new Circle(1)],
		mass: 2,
		inertia: 3,
		position: new Vector2(4, 5),
		velocity: new Vector2(6, 7),
		damping: 8,
		angle: 0.5,
		angularVelocity: 10,
		angularDamping: 11
	})

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
		actor: null,
		shapes: [new Circle(1)],
		mass: 10,
		inertia: 20,
		position: new Vector2(0, 0),
		velocity: new Vector2(0, 0),
		damping: 0,
		angle: 0,
		angularVelocity: 0,
		angularDamping: 0
	})

	for (let i = 0; i < 100; i++) {
		body.applyForce(new Vector2(30, 0))
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
		actor: null,
		shapes: [new Circle(1)],
		mass: 1,
		inertia: 1,
		position: new Vector2(0, 0),
		velocity: new Vector2(10, 0),
		damping: 0.7,
		angle: 0,
		angularVelocity: 10,
		angularDamping: 0.3
	})

	for (let i = 0; i < 100; i++) {
		physics.step(0.01)
	}

	assertApprox(body.getVelocity().x, Math.exp(-0.7) * 10, "velocity after damping")
	assertApprox(body.getAngularVelocity(), Math.exp(-0.3) * 10, "angular velocity after angular damping")
})