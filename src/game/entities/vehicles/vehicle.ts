import { Entity } from "game/entities/entity"
import { Player } from "game/player"
import { Powerup } from "game/entities/powerups/powerup"
import { Vector2 } from "math"
import { RigidBody } from "game/physics/rigidbody"
import { Mesh } from "game/graphics/mesh"
import { assignRole, Role } from "../actor"

export const VEHICLE_RADIUS = 1

export let vehicleRole = new Role<Vehicle>("vehicle")

export class Vehicle extends Entity {
	public player: Player
	public activePowerup: Powerup | null = null
	public onPressTrigger = () => { }
	public onReleaseTrigger = () => { }
	public onUpdate = (dt: number) => { }

	private holdsTrigger: boolean = false
	private requiresRelease: boolean = false

	isFiring() { return this.holdsTrigger && !this.requiresRelease }
	requireTriggerRelease() { this.requiresRelease = true }

	constructor(
		player: Player,
		createBody: (self: Entity) => RigidBody,
		createMesh: (self: Entity) => Mesh
	) {
		super(createBody, createMesh);
		this.player = player
		assignRole(this, vehicleRole)
	}

	update(dt:number){

		if (this.player.controller.isShooting() && !this.holdsTrigger) {
			this.holdsTrigger = true
			this.onPressTrigger()
		}
		else if (!this.player.controller.isShooting() && this.holdsTrigger) {
			this.holdsTrigger = false
			this.requiresRelease = false
			this.onReleaseTrigger()
		}

	}

}

export type VehicleCtor = new (player: Player, position: Vector2) => Vehicle;