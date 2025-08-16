
import { Vector2, Vector3, Quaternion } from "math"
import { Defaults, Kind } from "utils/general"

export interface SceneNode<K extends Kind> {
	kind: K
	setPosition(position: Vector3): void
	setPositionXY(xy: Vector2): void
	setPositionZ(z: number): void
	setOrientation(orientation: Quaternion): void
	setAngle(angle: number): void
	copy2dPose(source: {
		getPosition(): Vector2
		getAngle(): number
	}): void
	setScale(scale: number | Vector3): void
	destroy(): void
}

export interface SceneNodeConfig<K extends Kind> {
	kind?: K
	position?: Vector3
	orientation?: Quaternion
	scale?: number | Vector3
}

export const sceneNodeDefaults: Omit<Defaults<SceneNodeConfig<"">>, "kind"> = {
	position: new Vector3(0, 0, 0),
	orientation: new Quaternion(0, 0, 0, 1),
	scale: 1
}