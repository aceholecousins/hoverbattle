
import { Color } from "utils/color"
import { ThreeSceneNode } from "./threescenenode"
import {
	PointLight,
	PointLightConfig,
	HemisphereLight,
	HemisphereLightConfig,
	LightFactory,
	pointLightDefaults,
	hemisphereLightDefaults
} from "game/graphics/light"
import * as THREE from "three"

export class ThreePointLight extends ThreeSceneNode<THREE.PointLight> implements PointLight {

	setIntensity(intensity: number) {
		this.threeObject.intensity = intensity
	}

	setColor(color: Color) {
		this.threeObject.color.setRGB(color.r, color.g, color.b)
	}

	constructor(scene: THREE.Scene, config: PointLightConfig) {
		const fullConfig: Required<PointLightConfig> = {...pointLightDefaults, ...config}
		super(scene, new THREE.PointLight(), fullConfig)

		this.setIntensity(fullConfig.intensity)
		this.setColor(fullConfig.color)
	}
}

export class ThreeHemisphereLight extends ThreeSceneNode<THREE.HemisphereLight> implements HemisphereLight {

	setGroundColor(color: Color) {
		this.threeObject.groundColor.setRGB(color.r, color.g, color.b)
	}

	setSkyColor(color: Color) {
		this.threeObject.color.setRGB(color.r, color.g, color.b)
	}

	constructor(scene: THREE.Scene, config: HemisphereLightConfig) {
		const fullConfig: Required<HemisphereLightConfig> = { ...hemisphereLightDefaults, ...config }
		super(scene, new THREE.HemisphereLight(), fullConfig)

		this.setGroundColor(fullConfig.groundColor)
		this.setSkyColor(fullConfig.skyColor)
	}
}

export class ThreeLightFactory implements LightFactory {
	threeScene: THREE.Scene

	constructor(scene: THREE.Scene) {
		this.threeScene = scene
	}

	createPointLight(config: PointLightConfig) {
		return new ThreePointLight(this.threeScene, config)
	}

	createHemisphereLight(config: HemisphereLightConfig) {
		return new ThreeHemisphereLight(this.threeScene, config)
	}
}