
import { vec2, vec3, quat } from "gl-matrix"
import { Kind, copyIfPresent } from "utils/general"

export interface SceneNode<K extends Kind> {
	kind: K
	setPosition?(position: vec3): void
	setPositionXY?(xy: vec2): void
	setPositionZ?(z: number): void
	setOrientation?(orientation: quat): void
	setAngle?(angle: number): void
	copy2dPose?(source: {
		position: vec2
		angle: number
	}): void
	setScale?(scale: number | vec3): void
	destroy(): void
}

export class SceneNodeConfig<K extends Kind> {
	kind: K
	position = vec3.fromValues(0, 0, 0)
	orientation = quat.fromValues(0, 0, 0, 1)
	scale:number | vec3 = vec3.fromValues(1, 1, 1)

	constructor(config: Partial<SceneNodeConfig<K>> = {}) {
		this.kind = config.kind
		copyIfPresent(this, config, ["position", "orientation", "scale"])
	}
}
