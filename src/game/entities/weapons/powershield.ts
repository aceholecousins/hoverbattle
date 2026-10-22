import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine, getEngine } from "game/engine";
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle";
import { Powerup } from "game/entities/powerups/powerup";
import { Visual } from "game/graphics/visual";
import { Quaternion } from "math"
import { collideWithEverythingRole, Entity } from "game/entities/entity";
import { Circle } from "game/physics/shapes";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { Attachment } from "game/physics/physics";
import { Color, colorLerp } from "utils/color";
import { Resource } from "game/resourcemanager";
import { Destructible, makeDamaging, makeDestructible } from "../damage";
import { assignRole } from "../actor";

const POWERSHIELD_RADIUS = VEHICLE_RADIUS * 1.5
const POWERSHIELD_DURATION = 10
const POWERSHIELD_DAMAGE = 7
const POWERSHIELD_DAMAGE_COOLDOWN_FRAMES = 3 // avoid repeated damage from single hit
const POWERSHIELD_IMPULSE = 20

export class PowerShield extends Entity {
	private time = 0
	private attachment: Attachment
	private targetAccentColor: Color
	private currentAccentColor: Color
	private damageCooldown: Map<Entity, number> = new Map()

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/powershield.glb")
	)

	constructor(
		public parent: Vehicle
	) {
		let createBody = (self: Entity) => {
			let body = getEngine().physics.addRigidBody({
				actor: self,
				shapes: [new Circle(POWERSHIELD_RADIUS)],
				mass: 0.01,
				damping: 0,
				angularDamping: 0
			})
			body.copyPosition(parent.body)
			return body
		}
		let createMesh = (self: Entity) => {
			let mesh = getEngine().graphics.mesh.createFromModel({ model: PowerShield.model.get().model })
			mesh.setPositionZ(0.1)
			mesh.setScale(POWERSHIELD_RADIUS)
			mesh.setBaseColor(parent.player.color)
			return mesh
		}

		super(createBody, createMesh);

		assignRole(this, collideWithEverythingRole)

		makeDamaging(this, 0, (self, other: Destructible) => { // damage of 0 here to avoid multiple hits, damaging handled below
			if (other instanceof Entity && !self.damageCooldown.has(other)) {
				other.hit(POWERSHIELD_DAMAGE)
				const impulse = other.body.getPosition().clone().sub(self.body.getPosition()).setLength(POWERSHIELD_IMPULSE)
				other.body.applyGlobalImpulse(impulse, other.body.getPosition())
				self.damageCooldown.set(other, POWERSHIELD_DAMAGE_COOLDOWN_FRAMES)
			}
		})
		makeDestructible(this, Infinity, () => { })

		this.currentAccentColor = colorLerp(parent.player.color, { r: 0, g: 0, b: 0 }, 0.5)
		this.targetAccentColor = colorLerp(parent.player.color, { r: 0, g: 0, b: 0 }, 0.5)

		this.attachment = getEngine().physics.attach({
			bodyA: this.parent.body,
			bodyB: this.body,
			canCollide: false
		})
		this.parent.onDispose(() => this.dispose())
		this.update(0)
	}

	flash() {
		this.currentAccentColor = { r: 1, g: 1, b: 1 }
	}

	update(dt: number) {
		this.time += dt

		this.currentAccentColor = colorLerp(
			this.currentAccentColor,
			this.targetAccentColor,
			0.06
		)

		this.mesh.setAccentColor1(this.currentAccentColor)

		// this is slightly cheating, it hides the elasticity of the attachment
		this.mesh.setPositionXY(this.parent.body.getPosition())

		this.mesh.setOrientation(new Quaternion().random())

		for (const [key, value] of this.damageCooldown) {
			if (value <= 1) {
				this.damageCooldown.delete(key);
			} else {
				this.damageCooldown.set(key, value - 1);
			}
		}

		if (this.time > POWERSHIELD_DURATION) {
			this.parent.activePowerup?.cancel?.()
		}
	}

	dispose() {
		this.attachment.detach()
		super.dispose()
	}
}
