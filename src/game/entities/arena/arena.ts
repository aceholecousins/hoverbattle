import { EmptyMesh, ModelMeshConfig } from "game/graphics/mesh"
import { Engine, getEngine } from "game/engine"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Triangle } from "game/physics/shapes"
import { triangle3to2, Triangle3 } from "math"
import { Entity } from "game/entities/entity"


export class ArenaPart extends Entity {

	constructor(
		tri: Triangle3,
	) {
		let createBody = (self: Entity) => {
			return getEngine().physics.addRigidBody({
				actor: self,
				static: true,
				shapes: [new Triangle(triangle3to2(tri))]
			})
		}
		let createMesh = (self: Entity) => {
			return new EmptyMesh()
		}
		super(createBody, createMesh)
	}
}


export async function loadArena(
	modelFile: string
) {
	// This function used to return one body with many shapes.
	// However, the broadphase of the physics engine only checks
	// complete bodies against each other, so everything always got
	// narrowphase checked against all shapes of the arena which was
	// very slow. Now we return many bodies with one shape each, which
	// is much faster.

	let { model, meta } = await getEngine().graphics.loadModel(modelFile)

	let arenaParts: Entity[] = []

	for (let tri of (meta.collision as Triangle3[])) {
		arenaParts.push(new ArenaPart(tri))
	}

	getEngine().graphics.mesh.createFromModel({ model })

	return { arenaParts, meta }
}
