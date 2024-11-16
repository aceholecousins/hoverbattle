
import { ReadonlyVec2, vec3, ReadonlyVec3, quat } from "gl-matrix"
import { Kind, copyIfPresent } from "utils/general"

export interface SceneNode<K extends Kind> {
	kind: K
	setPosition?(position: ReadonlyVec3): void
	setPositionXY?(xy: ReadonlyVec2): void
	setPositionZ?(z: number): void
	setOrientation?(orientation: quat): void
	setAngle?(angle: number): void
	copy2dPose?(source: {
		getPosition(): ReadonlyVec2
		getAngle(): number
	}): void
	setScale?(scale: number | ReadonlyVec3): void
	destroy(): void
}

export class SceneNodeConfig<K extends Kind> {
	kind: K
	position = vec3.fromValues(0, 0, 0)
	orientation = quat.fromValues(0, 0, 0, 1)
	scale:number | vec3 = 1

	constructor(config: Partial<SceneNodeConfig<K>> = {}) {
		this.kind = config.kind
		copyIfPresent(this, config, ["position", "orientation", "scale"])
	}
}
