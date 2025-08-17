
import { Defaults } from "utils/general"
import { Color } from "utils/color"
import { SceneNode, SceneNodeConfig, sceneNodeDefaults } from "./scenenode"

export interface PointLight extends SceneNode {
	setColor(color: Color): void
	setIntensity(intensity: number): void
}

export interface PointLightConfig extends SceneNodeConfig {
	kind?: "pointlight"
	color?: Color
	intensity?: number
}

export const pointLightDefaults: Defaults<PointLightConfig> = {
	...sceneNodeDefaults,
	kind: "pointlight",
	color: { r: 1, g: 1, b: 1 },
	intensity: 1
}

export interface HemisphereLight extends SceneNode {
	setGroundColor(color: Color): void
	setSkyColor(color: Color): void
}

export interface HemisphereLightConfig extends SceneNodeConfig {
	kind?: "hemispherelight"
	groundColor?: Color
	skyColor?: Color
}

export const hemisphereLightDefaults: Defaults<HemisphereLightConfig> = {
	...sceneNodeDefaults,
	kind: "hemispherelight",
	groundColor: { r: 0.8, g: 0.6, b: 0.4 },
	skyColor: { r: 0.0, g: 0.5, b: 1.0 }
}

export interface LightFactory {
	createPointLight(config: PointLightConfig): PointLight
	createHemisphereLight(config: HemisphereLightConfig): HemisphereLight
}