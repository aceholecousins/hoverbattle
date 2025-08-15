
import { copyIfPresent } from "utils/general"
import { Color } from "utils/color"
import { SceneNode, SceneNodeConfig } from "./scenenode"
import { Model } from "./asset"
import { Vector2, Vector3, Quaternion } from "math"

export interface Mesh extends SceneNode<"mesh"> {
	setBaseColor(color: Color): void
	setAccentColor1(color: Color): void
	setAccentColor2(color: Color): void
	setOpacity(opacity: number): void
}

export class EmptyMesh implements Mesh {
	kind: "mesh" = "mesh"
	setPosition(position: Vector3) { }
	setPositionXY(xy: Vector2) { }
	setPositionZ(z: number) { }
	setOrientation(orientation: Quaternion) { }
	setAngle(angle: number) { }
	copy2dPose(source: {
		getPosition(): Vector2
		getAngle(): number
	}) { }
	setScale(scale: number | Vector3) { }
	destroy() { }
	setBaseColor(color: Color) { }
	setAccentColor1(color: Color) { }
	setAccentColor2(color: Color) { }
	setOpacity(opacity: number) { }
}
export class MeshConfig extends SceneNodeConfig<"mesh"> {
	kind: "mesh" = "mesh"
	baseColor: Color = { r: 1, g: 1, b: 1 }
	accentColor1: Color = { r: 1, g: 0, b: 0 }
	accentColor2: Color = { r: 0, g: 1, b: 0 }
	opacity: number = 1

	constructor(config: Partial<MeshConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["baseColor", "accentColor1", "accentColor2", "opacity"])
	}
}

export class ModelMeshConfig extends MeshConfig {
	model: Model
	constructor(config: Partial<MeshConfig> & Pick<ModelMeshConfig, "model">) {
		super(config)
		this.model = config.model
	}
}

export interface MeshFactory {
	createFromModel: (config: ModelMeshConfig) => Mesh
}