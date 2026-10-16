import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine, getEngine } from "game/engine"
import { Vector3 } from "math"
import { Color, colorLerp } from "utils/color"
import { Visual } from "game/graphics/visual"
import { memoize } from "utils/general"
import { Resource } from "game/resourcemanager"

let DURATION = 0.5

export class Smoke extends Visual {
	time: number = 0

	private static model = new Resource(() =>
		getEngine().graphics.loadSprite("assets/sprites/smoke.png")
	)

	constructor(
		position: Vector3,
		color: Color,
	) {
		let mesh = getEngine().graphics.mesh.createFromModel({ model: Smoke.model.get() })
		mesh.setScale(2)
		mesh.setPosition(position)
		mesh.setAngle(Math.random() * 6.28)
		mesh.setOpacity(0.2)
		super(mesh)
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
