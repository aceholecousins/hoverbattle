
import { Defaults } from "utils/general"
import { Color } from "utils/color"
import { SceneNode, SceneNodeConfig, sceneNodeDefaults } from "./scenenode"
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

export interface MeshConfig extends SceneNodeConfig<"mesh"> {
	baseColor?: Color
	accentColor1?: Color
	accentColor2?: Color
	opacity?: number
}

export const meshConfigDefaults: Defaults<MeshConfig> = {
	...sceneNodeDefaults,
	kind: "mesh",
	baseColor: { r: 1, g: 1, b: 1 },
	accentColor1: { r: 1, g: 0, b: 0 },
	accentColor2: { r: 0, g: 1, b: 0 },
	opacity: 1
}

export interface ModelMeshConfig extends MeshConfig {
	model: Model
}

export const modelMeshDefaults: Defaults<ModelMeshConfig> = meshConfigDefaults

export interface MeshFactory {
	createFromModel: (config: ModelMeshConfig) => Mesh
}