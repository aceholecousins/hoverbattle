import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { quat, vec2, vec3 } from "gl-matrix";
import { Glider, GLIDER_RADIUS } from "../glider/glider";
import { Powerup } from "game/entities/powerups/powerup";
import { Visual } from "game/graphics/visual";
import { Entity } from "game/entities/entity";
import { CircleConfig } from "game/physics/circle";
import { RigidBodyConfig } from "game/physics/rigidbody";
import { Attachment } from "game/physics/physics";
import { Color, colorLerp } from "utils";

const POWERSHIELD_RADIUS = GLIDER_RADIUS * 1.5

export class PowerShieldPowerup implements Powerup {
	public readonly kind = "powershield"
}

export class PowerShield extends Entity {
	private time = 0
	private attachment: Attachment
	private targetAccentColor: Color
	private currentAccentColor: Color

	constructor(
		public parent: Glider,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: model })
		)
		this.mesh.scaling = vec3.fromValues(POWERSHIELD_RADIUS, POWERSHIELD_RADIUS, POWERSHIELD_RADIUS)
		this.mesh.baseColor = parent.player.color
		this.currentAccentColor = colorLerp(parent.player.color, { r: 0, g: 0, b: 0 }, 0.5)
		this.targetAccentColor = colorLerp(parent.player.color, { r: 0, g: 0, b: 0 }, 0.5)

		const bodyCfg = new RigidBodyConfig({
			actor: this,
			shapes: [new CircleConfig({ radius: POWERSHIELD_RADIUS })],
			mass: 0.01,
			damping: 0,
			angularDamping: 0
		})
		this.body = engine.physics.addRigidBody(bodyCfg)
		this.body.position = this.parent.body.position
		this.attachment = engine.physics.attach(this.parent.body, this.body)
		this.attachment.setCanCollide(false)
		this.attachment.setStiffness(1e6)
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

		this.mesh.accentColor1 = this.currentAccentColor

		this.mesh.position = [
			// this is slightly cheating, it hides the elasticity of the attachment
			this.parent.body.position[0], this.parent.body.position[1], 0.1
		]
		this.mesh.orientation = quat.fromEuler(
			quat.create(),
			Math.random() * 360,
			Math.random() * 360,
			Math.random() * 360
		)
	}

	dispose() {
		this.attachment.detach()
		super.dispose()
	}
}

export async function createPowerShieldFactory(engine: Engine) {
	let { model, meta } = await engine.graphics.loadModel(
		"assets/models/powershield.glb")

	return function (parent: Glider): PowerShield {
		return new PowerShield(parent, model, engine);
	}
}
