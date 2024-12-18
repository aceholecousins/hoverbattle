
import { SceneNode, SceneNodeConfig } from "./scenenode"
import { copyIfPresent } from "utils/general"

export interface Camera extends SceneNode<"camera"> {
	activate(): void
}

export class CameraConfig extends SceneNodeConfig<"camera"> {
	kind: "camera" = "camera"
	nearClip = 0.1
	farClip = 1000
	verticalAngleOfViewInDeg = 40
	onAspectChange = function (aspect: number) { }

	constructor(config: Partial<CameraConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["nearClip", "farClip", "verticalAngleOfViewInDeg"])
	}
}

export interface CameraFactory {
	create(config: CameraConfig): Camera
}