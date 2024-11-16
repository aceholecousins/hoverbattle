
import { vec2 } from "gl-matrix"
import { Kind, copyIfPresent } from "utils/general"

// parameters that are common to all shapes

export interface Shape<K extends Kind> {
	kind: K
	setOffsetPosition(position: vec2): void
	getOffsetPosition(): vec2
	setOffsetAngle(angle: number):void
	getOffsetAngle(): number
	setBoundingRadius(radius: number): void
	getBoundingRadius(): number
}

export class ShapeConfig<K extends Kind> {
	kind: K
	offsetPosition = vec2.fromValues(0, 0)
	offsetAngle = 0

	constructor(config: Partial<ShapeConfig<K>>) {
		this.kind = config.kind
		copyIfPresent(this, config, ["offsetPosition", "offsetAngle"])
	}
}