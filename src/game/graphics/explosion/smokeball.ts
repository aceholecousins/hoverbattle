import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine } from "game/engine"
import { vec3, quat } from "gl-matrix"
import { Color, colorLerp } from "utils"
import { Visual } from "game/graphics/visual"

const DURATION = 0.5

export class Smokeball extends Visual {
	time: number = 0
	color: Color

	constructor(
		position: vec3,
		color: Color,
		model: Model,
		engine: Engine
	) {
		super()
		this.color = color
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(0.01, 0.01, 0.01)
		this.mesh.position = position
		this.mesh.orientation = quat.fromEuler(
			quat.create(),
			Math.random() * 360,
			Math.random() * 360,
			Math.random() * 360
		)
		this.mesh.baseColor = { r: 1, g: 1, b: 1 }
		this.mesh.accentColor1 = { r: 1, g: 1, b: 1 }
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		let size = this.time * 16

		this.mesh.baseColor = colorLerp(
			{ r: 1, g: 1, b: 1 },
			this.color,
			this.time / DURATION
		)
		this.mesh.accentColor1 = colorLerp(
			this.color,
			{ r: 0, g: 0, b: 0 },
			this.time / DURATION
		)

		if (this.time > DURATION * 0.8) {
			this.mesh.opacity = 1 - (this.time - DURATION * 0.8) / (DURATION * 0.2)
		}

		this.mesh.scaling = vec3.fromValues(size, size, size)
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}


export async function createSmokeballFactory(engine: Engine) {

	let { model, meta } = await engine.graphics.loadModel(
		"game/graphics/explosion/smokeball.glb")

	return function (position: vec3, color: Color) {
		return new Smokeball(
			position,
			color,
			model,
			engine
		)
	}
}
