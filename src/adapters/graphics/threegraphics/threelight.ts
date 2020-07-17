
import {Color} from "utils"
import {ThreeGraphicsObject} from "./threegraphicsobject"
import {
	PointLight,
	PointLightConfig,
	HemisphereLight,
	HemisphereLightConfig,
	LightFactory
} from "domain/graphics/light"
import * as THREE from "three"

export class ThreePointLight extends ThreeGraphicsObject<"pointlight"> implements PointLight{

	threeObject:THREE.PointLight

	set color(col:Color){
		this.threeObject.color.setRGB(col.r, col.g, col.b)
	}

	constructor(scene:THREE.Scene, config:PointLightConfig){
		super(scene, new THREE.PointLight(), config)

		this.color = config.color
	}
}

export class ThreeHemisphereLight extends ThreeGraphicsObject<"hemispherelight"> implements HemisphereLight{

	threeObject:THREE.HemisphereLight

	set groundColor(col:Color){
		this.threeObject.groundColor.setRGB(col.r, col.g, col.b)
	}

	set skyColor(col:Color){
		this.threeObject.color.setRGB(col.r, col.g, col.b)
	}

	constructor(scene:THREE.Scene, config:HemisphereLightConfig){
		super(scene, new THREE.HemisphereLight(), config)

		this.groundColor = config.groundColor
		this.skyColor = config.skyColor
	}
}

export class ThreeLightFactory implements LightFactory{
	threeScene:THREE.Scene

	constructor(scene:THREE.Scene){
		this.threeScene = scene
	}

	createPointLight(config: PointLightConfig){
		return new ThreePointLight(this.threeScene, config)
	}

	createHemisphereLight(config: HemisphereLightConfig){
		return new ThreeHemisphereLight(this.threeScene, config)
	}
}