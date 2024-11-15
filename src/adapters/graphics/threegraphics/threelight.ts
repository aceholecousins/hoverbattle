
import { Color } from "utils/color"
import { ThreeSceneNode } from "./threescenenode"
import {
	PointLight,
	PointLightConfig,
	HemisphereLight,
	HemisphereLightConfig,
	LightFactory
} from "game/graphics/light"
import * as THREE from "three"

export class ThreePointLight extends ThreeSceneNode<"pointlight"> implements PointLight {

	threeObject: THREE.PointLight

	setIntensity(intensity: number) {
		this.threeObject.intensity = intensity
	}

	setColor(color: Color) {
		this.threeObject.color.setRGB(color.r, color.g, color.b)
	}

	constructor(scene: THREE.Scene, config: PointLightConfig) {
		super(scene, new THREE.PointLight(), config)

		this.setIntensity(config.intensity)
		this.setColor(config.color)
	}
}

export class ThreeHemisphereLight extends ThreeSceneNode<"hemispherelight"> implements HemisphereLight {

	threeObject: THREE.HemisphereLight

	setGroundColor(color: Color) {
		this.threeObject.groundColor.setRGB(color.r, color.g, color.b)
	}

	setSkyColor(color: Color) {
		this.threeObject.color.setRGB(color.r, color.g, color.b)
	}

	constructor(scene: THREE.Scene, config: HemisphereLightConfig) {
		super(scene, new THREE.HemisphereLight(), config)

		this.setGroundColor(config.groundColor)
		this.setSkyColor(config.skyColor)
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