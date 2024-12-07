
import { Vector2, Vector3, Quaternion } from "math"
import { Kind, copyIfPresent } from "utils/general"

export interface SceneNode<K extends Kind> {
	kind: K
	setPosition?(position: Vector3): void
	setPositionXY?(xy: Vector2): void
	setPositionZ?(z: number): void
	setOrientation?(orientation: Quaternion): void
	setAngle?(angle: number): void
	copy2dPose?(source: {
		getPosition(): Vector2
		getAngle(): number
	}): void
	setScale?(scale: number | Vector3): void
	destroy(): void
}

export class SceneNodeConfig<K extends Kind> {
	kind: K
	position = new Vector3(0, 0, 0)
	orientation = new Quaternion(0, 0, 0, 1)
	scale: number | Vector3 = 1

	constructor(config: Partial<SceneNodeConfig<K>> = {}) {
		this.kind = config.kind
		copyIfPresent(this, config, ["position", "orientation", "scale"])
	}
}
