import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine, onEngineReady } from "game/engine"
import { Circle } from "game/physics/shapes"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { Vector2, ypr, DEG } from "math"
import { Entity } from "game/entities/entity"
import { Vehicle, vehicleRole } from "../vehicles/vehicle"
import { getEngine } from "game/engine"
import { assignRole, Role } from "../actor"
import { CollisionHandler } from "game/physics/collision"
import { assertNull } from "utils/general"
import constants from "node:constants"

const POWERUP_BOX_SIZE = 1.8

export interface Powerup {
	// interface to control collected powerups
	pressTrigger?: () => void
	releaseTrigger?: () => void
	cancel?: () => void
}

export type PowerupBoxCtor = new (position: Vector2) => PowerupBox;

let powerupBoxRole = new Role<PowerupBox>("powerupBox")

export class PowerupBox extends Entity {
	// base class for powerup boxes

	time: number = 0

	constructor(
		position: Vector2,
		model: Model
	) {
		let createBody = (self: Entity) => {
			let body = getEngine().physics.addRigidBody({
				actor: self,
				shapes: [new Circle(POWERUP_BOX_SIZE * 0.6)],
				damping: 0.7,
				angularDamping: 0.7
			})
			body.setPosition(position)
			body.setAngle(Math.random() * Math.PI * 2)
			return body
		}
		let createMesh = (self: Entity) => {
			let mesh = getEngine().graphics.mesh.createFromModel({ model })
			mesh.setPositionZ(0.1)
			mesh.setScale(POWERUP_BOX_SIZE)
			return mesh
		}
		super(createBody, createMesh)
		this.update(0)
		assignRole(this, powerupBoxRole)
	}

	onCollect(collector: Vehicle): void {
		// abstract method to be extended by subclasses
		assertNull(collector.activePowerup, "activePowerup not empty")
		this.dispose()
	}

	update(dt: number) {
		this.time += dt
		this.mesh.setPositionXY(this.body.getPosition())
		this.mesh.setOrientation(ypr(
			this.body.getAngle(),
			17 * DEG * Math.sin(1.1337 * this.time),
			20 * DEG * Math.sin(this.time),
		))
	}
}

export const replaceCurrentPowerup = (vehicle: Vehicle, powerupBox: PowerupBox) => {
	vehicle.activePowerup?.cancel?.()
	powerupBox.onCollect(vehicle)
	powerupBox.dispose()
}

export const ignoreNewPowerup = (vehicle: Vehicle, powerupBox: PowerupBox) => { 
	if(vehicle.activePowerup === null){
		powerupBox.onCollect(vehicle)
	}
	powerupBox.dispose()
}

let powerupCollectionHandler: (vehicle: Vehicle, powerupBox: PowerupBox) => void = replaceCurrentPowerup

export const setPowerupCollectionHandler = (handler: (vehicle: Vehicle, powerupBox: PowerupBox) => void) => {
	powerupCollectionHandler = handler
}

onEngineReady(engine => {
	engine.physics.registerCollisionHandler(new CollisionHandler(
		vehicleRole, powerupBoxRole, (vehicle: Vehicle, powerupBox: PowerupBox) => {
			powerupCollectionHandler(vehicle, powerupBox)
		}
	))
})

/*
export async function createPowerupBoxFactory(engine: Engine) {

	let [laser, mine, missile, nashwan, repair, powershield, minigun] = await Promise.all([
		engine.graphics.loadModel("assets/models/lasercrate.glb"),
		engine.graphics.loadModel("assets/models/minecrate.glb"),
		engine.graphics.loadModel("assets/models/missilecrate.glb"),
		engine.graphics.loadModel("assets/models/nashwancrate.glb"),
		engine.graphics.loadModel("assets/models/repaircrate.glb"),
		engine.graphics.loadModel("assets/models/powershieldcrate.glb"),
		engine.graphics.loadModel("assets/models/miniguncrate.glb")
	])
	let models = { laser, mine, missile, nashwan, repair, powershield, minigun }

	return function (kind: PowerupKind, position: Vector2) {
		return new PowerupBox(
			kind,
			position,
			models[kind].model,
			engine
		)
	}
}
*/
