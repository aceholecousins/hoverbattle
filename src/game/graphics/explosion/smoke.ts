import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine } from "game/engine"
import { Vector3 } from "math"
import { Color, colorLerp } from "utils/color"
import { Visual } from "game/graphics/visual"
import { memoize } from "utils/general"

let DURATION = 0.5

export class Smoke extends Visual {
	time: number = 0

	constructor(
		position: Vector3,
		model: Model,
		color: Color,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(2)
		this.mesh.setPosition(position)
		this.mesh.setAngle(Math.random() * 6.28)
		this.mesh.setOpacity(0.2)
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.mesh.setScale(3 * (1 - this.time / DURATION))
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export type SmokeFactory = (position: Vector3, color: Color) => Smoke
export let createSmokeFactory = memoize(async function (engine: Engine) {
	let smokeModel = await engine.graphics.loadSprite(
		"assets/sprites/smoke.png")

	return function (position: Vector3, color: Color) {
		return new Smoke(position, smokeModel, color, engine)
	}
})
