
import { copyIfPresent } from "utils/general"
import { Color } from "utils/color"
import { SceneNode, SceneNodeConfig } from "./scenenode"

export interface PointLight extends SceneNode<"pointlight"> {
	setColor(color: Color): void
	setIntensity(intensity: number): void
}

export class PointLightConfig extends SceneNodeConfig<"pointlight"> {
	kind: "pointlight" = "pointlight"
	color: Color = { r: 1, g: 1, b: 1 }
	intensity: number = 1

	constructor(config: Partial<PointLightConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["color", "intensity"])
	}
}


export interface HemisphereLight extends SceneNode<"hemispherelight"> {
	setGroundColor(color: Color): void
	setSkyColor(color: Color): void
}

export class HemisphereLightConfig extends SceneNodeConfig<"hemispherelight"> {
	kind: "hemispherelight" = "hemispherelight"
	groundColor: Color = { r: 0.8, g: 0.6, b: 0.4 }
	skyColor: Color = { r: 0.0, g: 0.5, b: 1.0 }

	constructor(config: Partial<HemisphereLightConfig> = {}) {
		super(config)
		if (config.groundColor !== undefined) { this.groundColor = config.groundColor }
		if (config.skyColor !== undefined) { this.skyColor = config.skyColor }
	}
}


export interface LightFactory {
	createPointLight(config: PointLightConfig): PointLight
	createHemisphereLight(config: HemisphereLightConfig): HemisphereLight
}