
import { SceneNode, SceneNodeConfig, sceneNodeDefaults } from "./scenenode"
import { Defaults } from "utils/general"

export interface Camera extends SceneNode<"camera"> {
	activate(): void
}

export interface CameraConfig extends SceneNodeConfig<"camera"> {
	nearClip?: number
	farClip?: number
	verticalAngleOfViewInDeg?: number
	onAspectChange?: (aspect: number) => void
}

export const cameraDefaults: Defaults<CameraConfig> = {
	...sceneNodeDefaults,
	kind: "camera",
	nearClip: 0.1,
	farClip: 1000,
	verticalAngleOfViewInDeg: 40,
	onAspectChange: function (aspect: number) { }
}

export interface CameraFactory {
	create(config: CameraConfig): Camera
}