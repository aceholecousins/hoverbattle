import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine } from "game/engine"
import { vec3, quat } from "gl-matrix"
import { Color, colorLerp } from "utils"
import { Visual } from "game/graphics/visual"
import { memoize } from "utils"

let DURATION = 0.5

export class Smoke extends Visual {
	time: number = 0

	constructor(
		position: vec3,
		model: Model,
		color: Color,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(2, 2, 2)
		this.mesh.position = position
		this.mesh.orientation = quat.fromEuler(quat.create(), 0, 0, Math.random() * 360)
		this.mesh.opacity = 0.2
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		let size = 3 * (1 - this.time / DURATION)
		this.mesh.scaling = vec3.fromValues(size, size, size)
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export type SmokeFactory = (position: vec3, color: Color) => Smoke
export let createSmokeFactory = memoize(async function (engine: Engine) {
	let smokeModel = await engine.graphics.loadSprite(
		"assets/sprites/smoke.png")

	return function (position: vec3, color: Color) {
		return new Smoke(position, smokeModel, color, engine)
	}
})
