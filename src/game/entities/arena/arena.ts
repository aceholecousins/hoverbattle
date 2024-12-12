import { ModelMeshConfig } from "game/graphics/mesh"
import { Engine } from "game/engine"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Triangle } from "game/physics/shapes"
import { triangle3to2, Triangle3 } from "math"
import { Entity } from "../entity"

export async function loadArena(
	modelFile: string,
	engine: Engine
) {
	// This function used to return one body with many shapes.
	// However, the broadphase of the physics engine only checks
	// complete bodies against each other, so everything always got
	// narrowphase checked against all shapes of the arena which was
	// very slow. Now we return many bodies with one shape each, which
	// is much faster.

	let { model, meta } = await engine.graphics.loadModel(modelFile)

	let arenaParts: Entity[] = []

	for (let tri of (meta.collision as Triangle3[])) {
		let arenaPart = new Entity()
		arenaPart.body = engine.physics.addRigidBody(
			new RigidBodyConfig({
				actor: arenaPart,
				mass: Infinity,
				shapes: [new Triangle(triangle3to2(tri))]
			})
		)
		arenaParts.push(arenaPart)
	}

	engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))

	return { arenaParts, meta }
}
