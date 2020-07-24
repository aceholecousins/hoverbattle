
import {Color, copyIfPresent} from "utils"
import {SceneNode, SceneNodeConfig} from "./scenenode"

export interface PointLight extends SceneNode<"pointlight">{
	color: Color
}

export class PointLightConfig extends SceneNodeConfig<"pointlight">{
	kind: "pointlight" = "pointlight"
	color: Color = {r:1, g:1, b:1}

	constructor(config:Partial<PointLightConfig> = {}){
		super(config)
		copyIfPresent(this, config, ["color"])
	}	
}


export interface HemisphereLight extends SceneNode<"hemispherelight">{
	groundColor: Color
	skyColor: Color
}

export class HemisphereLightConfig extends SceneNodeConfig<"hemispherelight">{
	kind: "hemispherelight" = "hemispherelight"
	groundColor: Color = {r:0.8, g:0.6, b:0.4}
	skyColor: Color = {r:0.0, g:0.5, b:1.0}

	constructor(config:Partial<HemisphereLightConfig> = {}){
		super(config)
		if("groundColor" in config){this.groundColor = config.groundColor}
		if("skyColor" in config){this.skyColor = config.skyColor}
	}	
}


export interface LightFactory{
	createPointLight(config: PointLightConfig): PointLight
	createHemisphereLight(config: HemisphereLightConfig): HemisphereLight
}