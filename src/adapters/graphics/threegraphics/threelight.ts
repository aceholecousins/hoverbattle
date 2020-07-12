
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
		super(scene, config)
		this.threeObject = new THREE.PointLight()

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
		super(scene, config)
		this.threeObject = new THREE.HemisphereLight()

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
		let light = new ThreePointLight(this.threeScene, config)
		this.threeScene.add(light.threeObject)
		return light
	}

	createHemisphereLight(config: HemisphereLightConfig){
		let light = new ThreeHemisphereLight(this.threeScene, config)
		this.threeScene.add(light.threeObject)
		return light
	}
}