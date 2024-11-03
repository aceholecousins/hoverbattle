import { ModelMeshConfig } from "game/graphics/mesh"
import { Engine } from "game/engine"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { TriangleConfig } from "game/physics/triangle"
import { triangle3to2, Triangle3 } from "utilities/math_utils"
import { Entity } from "../entity"

export async function loadArena(
	modelFile: string,
	engine: Engine
) {

	let { model, meta } = await engine.graphics.loadModel(modelFile)

	let arena = new Entity()

	let shapes: TriangleConfig[] = []

	for (let tri of (meta.collision as Triangle3[])) {
		shapes.push(new TriangleConfig({ corners: triangle3to2(tri) }))
	}

	arena.body = engine.physics.addRigidBody(
		new RigidBodyConfig({
			actor: arena,
			mass: Infinity,
			shapes
		})
	)

	engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))

	return { arena, meta }
}